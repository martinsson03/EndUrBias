import spacy
from spacy import displacy
from PIL import Image, ImageDraw
import fitz  # PyMuPDF
from pathlib import Path
import re

# ------------------------------------------------------------
# TEXT EXTRACTOR
# ------------------------------------------------------------
class EnhancedPDFTextExtractor:
    def __init__(self):
        pass
    
    def extract(self, pdf_bytes, scale=2.0):
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages = []
        
        zoom = fitz.Matrix(scale, scale)
        
        for page_num, page in enumerate(doc):
            # Render page as image
            pix = page.get_pixmap(matrix=zoom)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            # Extract ALL text elements, including headers
            text_instances = []
            instance_id = 0
            
            # Get text with detailed information
            text_dict = page.get_text("dict")
            
            # Process all blocks
            for block in text_dict["blocks"]:
                if block["type"] == 0:  # Text block
                    for line in block["lines"]:
                        for span_dict in line["spans"]:
                            text = span_dict["text"].strip()
                            if text:  # Only process non-empty text
                                bbox = self._scale_bbox(span_dict["bbox"], scale)
                                font_size = span_dict["size"] * scale
                                
                                # Store with metadata and unique ID
                                text_instances.append({
                                    'id': instance_id,
                                    'text': text,
                                    'bbox': bbox,
                                    'page_num': page_num,
                                    'font_size': font_size,
                                    'is_large_text': font_size > 16,
                                    'is_bold': 'bold' in span_dict["font"].lower() if span_dict["font"] else False
                                })
                                instance_id += 1
            
            pages.append({
                'page_num': page_num,
                'image': img,
                'scale': scale,
                'text_instances': text_instances,
                'all_text': ' '.join([t['text'] for t in text_instances])
            })
        
        doc.close()
        return pages
    
    def _scale_bbox(self, bbox, factor):
        return (
            bbox[0] * factor,
            bbox[1] * factor,
            bbox[2] * factor,
            bbox[3] * factor
        )


# ------------------------------------------------------------
# TARGETED PERSONAL INFO REDACTOR
# ------------------------------------------------------------
class TargetedPersonalInfoRedactor:
    def __init__(self, nlp_model):
        self.nlp = nlp_model
        
    def find_personal_info(self, pages):
        # Find ONLY truly personal information
        all_text = ""
        text_to_instance_map = []
        
        # Build complete text and mapping
        for page in pages:
            for instance in page['text_instances']:
                start = len(all_text)
                all_text += instance['text'] + " "
                end = len(all_text)
                
                text_to_instance_map.append({
                    'instance_id': instance['id'],
                    'page_num': page['page_num'],
                    'instance': instance,
                    'start': start,
                    'end': end
                })
        
        # Process with NLP
        doc_nlp = self.nlp(all_text)
        
        # Map entities back to text instances
        instances_to_redact = set()
        
        print("\n=== DETECTING PERSONAL INFORMATION ===")
        
        # 1. Find PERSON entities from NLP
        print("\n1. NLP Person Entities:")
        for ent in doc_nlp.ents:
            if ent.label_ in ['PERSON', 'PER']:
                # Check if this looks like a real person name (not a title)
                if self._is_likely_person_name(ent.text):
                    print(f"   ✓ '{ent.text}' → {ent.label_}")
                    
                    for mapping in text_to_instance_map:
                        if (mapping['start'] <= ent.start_char < mapping['end'] or
                            mapping['start'] <= ent.end_char < mapping['end']):
                            instances_to_redact.add((mapping['page_num'], mapping['instance_id']))
                else:
                    print(f"   ✗ Skipping (not a name): '{ent.text}'")
        
        # 2. Look for specific name patterns in headers/large text
        print("\n2. Name Pattern in Headers/Large Text:")
        for page in pages:
            for instance in page['text_instances']:
                # Only check large/bold text (likely name in CV)
                if instance['is_large_text'] or instance['is_bold']:
                    text = instance['text'].strip()
                    # Pattern for Swedish names: Firstname Lastname (with common endings)
                    if re.match(r'^[A-Z][a-z]+\s+[A-Z][a-z]+(sson|qvist|berg|ström|gren|lund)?$', text):
                        if text.lower() not in ['teaching assistant', 'summer intern', 'board member', 
                                               'warehouse worker', 'chairman', 'engineering project']:
                            print(f"   ✓ '{text}' → CV_HEADER_NAME")
                            instances_to_redact.add((page['page_num'], instance['id']))
        
        # 3. Contact information - VERY SPECIFIC patterns
        print("\n3. Contact Information:")
        
        # Swedish mobile phone (07X-XXX XX XX or 07XXXXXXXX)
        phone_pattern = r'\b07[0-9]\s*[-.]?\s*\d{3}\s*[-.]?\s*\d{2}\s*[-.]?\s*\d{2}\b'
        for match in re.finditer(phone_pattern, all_text):
            print(f"   ✓ '{match.group()}' → PHONE")
            for mapping in text_to_instance_map:
                if (mapping['start'] <= match.start() < mapping['end'] or
                    mapping['start'] <= match.end() < mapping['end']):
                    instances_to_redact.add((mapping['page_num'], mapping['instance_id']))
        
        # Email - specific pattern
        email_pattern = r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
        for match in re.finditer(email_pattern, all_text):
            print(f"   ✓ '{match.group()}' → EMAIL")
            for mapping in text_to_instance_map:
                if (mapping['start'] <= match.start() < mapping['end'] or
                    mapping['start'] <= match.end() < mapping['end']):
                    instances_to_redact.add((mapping['page_num'], mapping['instance_id']))
        
        # Now convert back to the actual instances
        redacted_instances = []
        for page_num, instance_id in instances_to_redact:
            for page in pages:
                if page['page_num'] == page_num:
                    for instance in page['text_instances']:
                        if instance['id'] == instance_id:
                            redacted_instances.append((page_num, instance))
                            break
        
        return redacted_instances, doc_nlp
    
    def _is_likely_person_name(self, text):
        """Check if text is likely a person name (not a title/job)"""
        text_lower = text.lower()
        
        # Common job titles to exclude
        job_titles = {
            'teaching assistant', 'summer intern', 'board member', 'warehouse worker',
            'chairman', 'software factory', 'company relations', 'computer science',
        }
        
        # If it's a known job title/location, skip it
        if text_lower in job_titles:
            return False
        
        # Check if it follows name pattern: Firstname Lastname
        words = text.split()
        if len(words) >= 2:
            # Both words start with capital letter
            if all(word[0].isupper() for word in words[:2]):
                # Not all caps (like "CI/CD")
                if not all(word.isupper() for word in words[:2]):
                    # Check for common Swedish name endings
                    last_word = words[-1].lower()
                    common_endings = ['sson', 'qvist', 'berg', 'ström', 'gren', 'lund', 'holm']
                    if any(last_word.endswith(ending) for ending in common_endings):
                        return True
                    # Also accept any two capitalized words that aren't titles
                    return True
        
        return False
    
    def create_redacted_pdf(self, original_pdf_path, pages, instances_to_redact, output_path):
        """Create redacted PDF using PyMuPDF's redaction annotations"""
        
        # Open the original PDF
        pdf_doc = fitz.open(original_pdf_path)
        
        # Group instances by page
        redactions_by_page = {}
        for page_num, instance in instances_to_redact:
            if page_num not in redactions_by_page:
                redactions_by_page[page_num] = []
            
            # Convert from image coordinates back to PDF coordinates
            page_scale = None
            for page in pages:
                if page['page_num'] == page_num:
                    page_scale = page['scale']
                    break
            
            if page_scale:
                pdf_bbox = (
                    instance['bbox'][0] / page_scale,
                    instance['bbox'][1] / page_scale,
                    instance['bbox'][2] / page_scale,
                    instance['bbox'][3] / page_scale
                )
                
                redactions_by_page[page_num].append(pdf_bbox)
        
        # Apply redactions to each page
        for page_num, bboxes in redactions_by_page.items():
            if page_num < len(pdf_doc):
                page = pdf_doc[page_num]
                
                for bbox in bboxes:
                    # Add redaction annotation
                    annot = page.add_redact_annot(bbox)
                
                # Apply all redactions on this page
                page.apply_redactions()
        
        # Save the redacted PDF
        pdf_doc.save(output_path)
        pdf_doc.close()
        
        print(f"\n✅ Redacted PDF saved to: {output_path}")
    
    def create_redacted_previews(self, pages, instances_to_redact, output_dir):
        """Create image previews of redactions"""
        output_dir = Path(output_dir)
        output_dir.mkdir(exist_ok=True)
        
        # Group instances by page
        redactions_by_page = {}
        for page_num, instance in instances_to_redact:
            if page_num not in redactions_by_page:
                redactions_by_page[page_num] = []
            redactions_by_page[page_num].append(instance)
        
        # Create redacted images
        for page in pages:
            page_num = page['page_num']
            img = page['image'].copy()
            draw = ImageDraw.Draw(img)
            
            if page_num in redactions_by_page:
                for instance in redactions_by_page[page_num]:
                    # Add padding around text
                    padding = 3
                    bbox = (
                        instance['bbox'][0] - padding,
                        instance['bbox'][1] - padding,
                        instance['bbox'][2] + padding,
                        instance['bbox'][3] + padding
                    )
                    draw.rectangle(bbox, fill="black", outline="black")
            
            # Save preview
            output_path = output_dir / f"page_{page_num + 1:03d}_redacted.png"
            img.save(output_path)
            print(f"Preview: {output_path}")


# ------------------------------------------------------------
# MAIN PROGRAM
# ------------------------------------------------------------
def main():
    # Load Swedish NLP model
    print("Loading Swedish NLP model...")
    nlp = spacy.load("sv_core_news_lg")
    
    # Specify your PDF file
    pdf_path = Path()
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found at {pdf_path}")
        return
    
    # Extract text from PDF
    print("\nExtracting text from PDF...")
    extractor = EnhancedPDFTextExtractor()
    
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()
    
    pages = extractor.extract(pdf_bytes, scale=2.0)
    
    print(f"Extracted {len(pages)} pages")
    total_instances = sum(len(p['text_instances']) for p in pages)
    print(f"Found {total_instances} text elements")
    
    # Find and redact personal information
    redactor = TargetedPersonalInfoRedactor(nlp)
    instances_to_redact, doc_nlp = redactor.find_personal_info(pages)
    
    if not instances_to_redact:
        print("\nNo personal information found to redact.")
        return
    
    print(f"\nFound {len(instances_to_redact)} text elements to redact")
    
    # Create output directory
    output_dir = Path("redacted_output")
    output_dir.mkdir(exist_ok=True)
    
    # Create redacted PDF
    redacted_pdf_path = output_dir / "redacted_cv.pdf"
    redactor.create_redacted_pdf(pdf_path, pages, instances_to_redact, redacted_pdf_path)
    
    # Create preview images
    print("\nCreating preview images...")
    redactor.create_redacted_previews(pages, instances_to_redact, output_dir / "previews")
    
    # Show what will be redacted
    print("\n=== FINAL REDACTION LIST ===")
    for page_num, instance in instances_to_redact:
        print(f"Page {page_num + 1}: '{instance['text']}'")
    
    # Optional: Show all entities found (for debugging)
    print("\n=== ALL ENTITIES FOUND (for reference) ===")
    entity_counts = {}
    for ent in doc_nlp.ents:
        entity_counts[ent.label_] = entity_counts.get(ent.label_, 0) + 1
        print(f"  {ent.text} → {ent.label_}")
    
    print("\n=== ENTITY COUNTS ===")
    for label, count in entity_counts.items():
        print(f"{label}: {count}")


if __name__ == "__main__":
    main()