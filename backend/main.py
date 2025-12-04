import spacy
from spacy import displacy
from pathlib import Path
import re

# ------------------------------------------------------------
# PERSONAL INFO REDACTOR
# ------------------------------------------------------------
class PersonalInfoRedactor:
    def __init__(self, nlp_model, applicant_name=None):
        self.nlp = nlp_model
        self.applicant_name = applicant_name
        self.redaction_map = {
            'PERSON': '[NAME]',
            'EMAIL': '[EMAIL]',
            'PHONE': '[PHONE]',
            'SSN': '[SSN]',
            'ADDRESS': '[ADDRESS]',
            'DATE': '[DATE]'
        }
        
    def find_personal_info(self, markdown_content):
        """Find personal information in markdown content"""
        print("\n=== DETECTING PERSONAL INFORMATION ===")
        
        instances_to_redact = []
        
        # Process the entire markdown content with NLP
        doc_nlp = self.nlp(markdown_content)
        
        # ===== DISPLACY SERVE FOR VISUALIZATION =====
        print("\n🌐 Starting displaCy server...")
        print("   Open http://localhost:5000 in your web browser")
        
        # Serve the visualization
        displacy.serve(doc_nlp, style="ent", port=5000, host="0.0.0.0")
        # ===== END OF DISPLACY SERVE CODE =====
        
        # 1. ###### Find PERSON entities ######
        print("\n1. NLP Person Entities:")
        for ent in doc_nlp.ents:
            if ent.label_ in ['PERSON', 'PER']:
                if self._is_likely_person_name(ent.text):
                    print(f"   ✓ '{ent.text}' → PERSON")
                    
                    # Try to split into first and last names
                    name_parts = ent.text.split()
                    if len(name_parts) >= 2:
                        # Redact first name
                        instances_to_redact.append({
                            'text': name_parts[0],
                            'start': ent.start_char,
                            'end': ent.start_char + len(name_parts[0]),
                            'type': 'FIRST_NAME',
                            'original_text': name_parts[0]
                        })
                        
                        # Redact last name
                        last_name_start = ent.start_char + len(name_parts[0]) + 1
                        instances_to_redact.append({
                            'text': ' '.join(name_parts[1:]),
                            'start': last_name_start,
                            'end': ent.end_char,
                            'type': 'LAST_NAME',
                            'original_text': ' '.join(name_parts[1:])
                        })
                    else:
                        instances_to_redact.append({
                            'text': ent.text,
                            'start': ent.start_char,
                            'end': ent.end_char,
                            'type': 'PERSON',
                            'original_text': ent.text
                        })
                else:
                    print(f"   ✗ Skipping (not a name): '{ent.text}'")

        
        # 2. ###### Look for applicant name specifically ######
        if self.applicant_name:
            print(f"\n2. Looking for applicant name: {self.applicant_name}")
            name_parts = self.applicant_name.split()
            
            if len(name_parts) >= 2:
                # Search for full name
                full_name_pattern = re.compile(r'\b' + re.escape(self.applicant_name) + r'\b', re.IGNORECASE)
                for match in re.finditer(full_name_pattern, markdown_content):
                    print(f"   ✓ Found full name: '{match.group()}'")
                    instances_to_redact.append({
                        'text': match.group(),
                        'start': match.start(),
                        'end': match.end(),
                        'type': 'PERSON',
                        'original_text': match.group()
                    })
                
                # Search for first name alone
                first_name = name_parts[0]
                first_name_pattern = re.compile(r'\b' + re.escape(first_name) + r'\b', re.IGNORECASE)
                for match in re.finditer(first_name_pattern, markdown_content):
                    # Check if this is not part of the already redacted full name
                    if not any(match.start() >= inst['start'] and match.end() <= inst['end'] 
                              for inst in instances_to_redact if inst['type'] == 'PERSON'):
                        print(f"   ✓ Found first name: '{match.group()}'")
                        instances_to_redact.append({
                            'text': match.group(),
                            'start': match.start(),
                            'end': match.end(),
                            'type': 'FIRST_NAME',
                            'original_text': match.group()
                        })
                
                # Search for last name alone (if exists)
                if len(name_parts) > 1:
                    last_name = ' '.join(name_parts[1:])
                    last_name_pattern = re.compile(r'\b' + re.escape(last_name) + r'\b', re.IGNORECASE)
                    for match in re.finditer(last_name_pattern, markdown_content):
                        # Check if this is not part of the already redacted full name
                        if not any(match.start() >= inst['start'] and match.end() <= inst['end'] 
                                  for inst in instances_to_redact if inst['type'] == 'PERSON'):
                            print(f"   ✓ Found last name: '{match.group()}'")
                            instances_to_redact.append({
                                'text': match.group(),
                                'start': match.start(),
                                'end': match.end(),
                                'type': 'LAST_NAME',
                                'original_text': match.group()
                            })
        
        # 3. Contact information patterns
        print("\n3. Contact Information:")
        
        # Email pattern
        email_pattern = r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
        for match in re.finditer(email_pattern, markdown_content):
            email_text = match.group()
            print(f"   ✓ '{email_text}' → EMAIL")
            instances_to_redact.append({
                'text': email_text,
                'start': match.start(),
                'end': match.end(),
                'type': 'EMAIL',
                'original_text': email_text
            })
        
        # Swedish mobile phone
        phone_pattern = r'\b07[0-9]\s*[-.]?\s*\d{3}\s*[-.]?\s*\d{2}\s*[-.]?\s*\d{2}\b'
        for match in re.finditer(phone_pattern, markdown_content):
            phone_text = match.group()
            print(f"   ✓ '{phone_text}' → PHONE")
            instances_to_redact.append({
                'text': phone_text,
                'start': match.start(),
                'end': match.end(),
                'type': 'PHONE',
                'original_text': phone_text
            })
        
        # 4. Social security numbers (Swedish)
        ssn_pattern = r'\b\d{6}[-+]?\d{4}\b'
        for match in re.finditer(ssn_pattern, markdown_content):
            ssn_text = match.group()
            print(f"   ✓ '{ssn_text}' → SSN")
            instances_to_redact.append({
                'text': ssn_text,
                'start': match.start(),
                'end': match.end(),
                'type': 'SSN',
                'original_text': ssn_text
            })
        
        # 5. Addresses (simple pattern)
        print("\n4. Address Information:")
        address_pattern = r'\b(\d+\s+[A-Z][a-z]+\s+(?:Street|St\.|Avenue|Ave\.|Road|Rd\.|Way|Lane|Ln\.|Gatan|Vägen))\b'
        for match in re.finditer(address_pattern, markdown_content, re.IGNORECASE):
            address_text = match.group(1)
            print(f"   ✓ '{address_text}' → ADDRESS")
            instances_to_redact.append({
                'text': address_text,
                'start': match.start(1),
                'end': match.end(1),
                'type': 'ADDRESS',
                'original_text': address_text
            })
        
        # 6. Dates that could be birth dates (YYYY-MM-DD or DD/MM/YYYY)
        print("\n5. Date Information:")
        date_patterns = [
            r'\b\d{4}-\d{2}-\d{2}\b',  # YYYY-MM-DD
            r'\b\d{2}/\d{2}/\d{4}\b',  # DD/MM/YYYY
            r'\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b'  # 1 Jan 1990
        ]
        
        for pattern in date_patterns:
            for match in re.finditer(pattern, markdown_content, re.IGNORECASE):
                date_text = match.group()
                # Check if this could be a birth date (years between 1900-2020)
                if self._could_be_birth_date(date_text):
                    print(f"   ✓ '{date_text}' → DATE")
                    instances_to_redact.append({
                        'text': date_text,
                        'start': match.start(),
                        'end': match.end(),
                        'type': 'DATE',
                        'original_text': date_text
                    })
        
        # Sort by start position (for proper redaction)
        instances_to_redact.sort(key=lambda x: x['start'])
        
        return instances_to_redact, doc_nlp
    
    def _is_likely_person_name(self, text):
        """Improved name detection for markdown content"""
        text_lower = text.lower().strip()
        
        # Exclude common non-name patterns
        non_names = {
            # Company/organization names
            'linkedin', 'github', 'stack overflow', 'google', 'microsoft', 'apple', 'amazon',
            'facebook', 'twitter', 'instagram', 'spotify', 'netflix',
            
            # Document sections
            'summary', 'experience', 'education', 'skills', 'projects', 'certifications',
            'references', 'contact', 'objective', 'profile',
            
            # Common non-name capitalized terms
            'university', 'college', 'institute', 'school', 'academy',
            'bachelor', 'master', 'phd', 'doctorate',
            'project', 'manager', 'engineer', 'developer', 'designer',
            'january', 'february', 'march', 'april', 'may', 'june', 'july',
            'august', 'september', 'october', 'november', 'december'
        }
        
        if text_lower in non_names:
            return False
        
        # Check if it's a single letter or initial
        if len(text) <= 2 and text.endswith('.'):
            return False
        
        # Check for all caps (likely acronyms)
        if text.isupper() and len(text) <= 5:
            return False
        
        # Check for email-like patterns
        if '@' in text or '.com' in text_lower or '.se' in text_lower:
            return False
        
        # Check for date patterns
        if re.search(r'\d{4}', text):
            return False
        
        # Check for URL patterns
        if re.search(r'https?://|www\.', text_lower):
            return False
        
        # Basic name pattern: At least two words, each starting with capital letter
        words = text.split()
        if len(words) >= 2:
            # Check if first two words start with capital letters
            if all(word and word[0].isupper() for word in words[:2]):
                # Additional check: not all words are capitalized
                if not all(word.isupper() for word in words):
                    return True
        
        return False
    
    def _could_be_birth_date(self, date_text):
        """Check if a date could be a birth date"""
        try:
            # Try to extract year
            year_match = re.search(r'\b(19\d{2}|20[0-1]\d)\b', date_text)
            if year_match:
                year = int(year_match.group(1))
                # Likely birth years (between 1900 and 2010)
                return 1900 <= year <= 2010
        except:
            pass
        return False
    
    # Rest of the methods remain the same...
    # [Keep the create_redacted_markdown, save_redaction_data, etc. methods as they were]
    def create_redacted_markdown(self, markdown_content, instances_to_redact, output_path):
        """Create redacted markdown file with specific labels"""
        
        # Create the output directory if it doesn't exist
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        redacted_content = markdown_content
        
        # Apply redactions in reverse order to maintain correct indices
        for instance in sorted(instances_to_redact, key=lambda x: x['start'], reverse=True):
            # Get the appropriate redaction label
            redaction_label = self.redaction_map.get(instance['type'], '[REDACTED]')
            
            # Replace the text with the redaction label
            redacted_content = (
                redacted_content[:instance['start']] + 
                redaction_label + 
                redacted_content[instance['end']:]
            )
        
        # Save the redacted markdown
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(redacted_content)
        
        print(f"\n✅ Redacted markdown saved to: {output_path}")
        
        return redacted_content
    
    def save_redaction_data(self, original_filename, original_content, redacted_content, instances_to_redact, output_dir):
        """Save all redaction data to the output folder"""
        
        # Ensure output directory exists
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # 1. Save detailed redaction report
        report_path = output_dir / f"{Path(original_filename).stem}_redaction_report.md"
        self._create_redaction_report(original_filename, instances_to_redact, report_path)
        
        # 2. Save redaction data as JSON
        json_path = output_dir / f"{Path(original_filename).stem}_redaction_data.json"
        redaction_data = {
            'original_file': original_filename,
            'total_redactions': len(instances_to_redact),
            'redactions_by_type': self._count_by_type(instances_to_redact),
            'redacted_instances': instances_to_redact,
            'original_length': len(original_content),
            'redacted_length': len(redacted_content)
        }
                
        # 3. Save a summary file
        summary_path = output_dir / f"{Path(original_filename).stem}_summary.txt"
        self._save_summary(original_filename, instances_to_redact, summary_path)
    
    def _create_redaction_report(self, filename, instances_to_redact, report_path):
        """Create a markdown report of what was redacted"""
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(f"# Redaction Report for `{filename}`\n\n")
            f.write(f"**Total redactions:** {len(instances_to_redact)}\n\n")
            
            # Group by type with counts
            by_type = {}
            for instance in instances_to_redact:
                if instance['type'] not in by_type:
                    by_type[instance['type']] = []
                by_type[instance['type']].append(instance['original_text'])
            
            f.write("## Summary by Category\n")
            for type_name, items in sorted(by_type.items()):
                redaction_label = self.redaction_map.get(type_name, '[REDACTED]')
                f.write(f"- **{type_name}** ({redaction_label}): {len(items)} occurrences\n")
            
            f.write("\n## Details\n")
            for type_name, items in sorted(by_type.items()):
                redaction_label = self.redaction_map.get(type_name, '[REDACTED]')
                f.write(f"\n### {type_name} ({redaction_label})\n")
                unique_items = set(items)
                for item in sorted(unique_items):
                    f.write(f"- `{item}`\n")
        
        print(f"📋 Redaction report saved to: {report_path}")
    
    def _count_by_type(self, instances_to_redact):
        """Count redactions by type"""
        counts = {}
        for instance in instances_to_redact:
            counts[instance['type']] = counts.get(instance['type'], 0) + 1
        return counts
    
    def _save_summary(self, filename, instances_to_redact, output_path):
        """Save a simple summary of redactions"""
        counts = self._count_by_type(instances_to_redact)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"Redaction Summary for: {filename}\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Total redactions: {len(instances_to_redact)}\n\n")
            
            f.write("Breakdown by type:\n")
            for type_name, count in sorted(counts.items()):
                redaction_label = self.redaction_map.get(type_name, '[REDACTED]')
                f.write(f"  {redaction_label} ({type_name}): {count}\n")
            
            f.write("\nRedaction labels used:\n")
            for type_name, label in self.redaction_map.items():
                f.write(f"  {type_name} → {label}\n")


# ------------------------------------------------------------
# MAIN PROGRAM
# ------------------------------------------------------------
def main():
    # Load NLP model
    print("Loading NLP model...")
    nlp = spacy.load("sv_core_news_sm")
    
    # Specify your markdown file
    file_name = input("\nPlease enter the markdown file name (e.g., cv.md): ").strip()
    md_path = Path("data") / file_name
    
    if not md_path.exists():
        print(f"\n ERROR: Markdown file not found at {md_path}")
        return
    
    applicant_name = input("Please enter the name of the individual: ").strip()
    
    # Read markdown content
    print(f"\n📖 Reading markdown file: {file_name}")
    
    try:
        with open(md_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        print(f"   File size: {len(markdown_content)} characters")
        
        # Find and redact personal information
        redactor = PersonalInfoRedactor(nlp, applicant_name)
        instances_to_redact, doc_nlp = redactor.find_personal_info(markdown_content)
        
        if not instances_to_redact:
            print("\nNo personal information found to redact.")
            return
        
        print(f"\n✅ Found {len(instances_to_redact)} instances to redact")
        
        # Create output directory
        output_dir = Path("redacted_output")
        output_dir.mkdir(exist_ok=True)
        
        # Create redacted markdown
        redacted_filename = f"redacted_{file_name}"
        redacted_md_path = output_dir / redacted_filename
        redacted_content = redactor.create_redacted_markdown(
            markdown_content, 
            instances_to_redact, 
            redacted_md_path
        )
        
        # Save additional redaction data
        redactor.save_redaction_data(
            file_name,
            markdown_content,
            redacted_content,
            instances_to_redact,
            output_dir
        )
        
        # Show summary
        print("\n" + "="*50)
        print("REDACTION COMPLETE")
        print("="*50)
        print(f"\n📁 Output saved to: {output_dir}/")
        print(f"   - {redacted_filename} (redacted markdown)")
        print(f"   - {Path(file_name).stem}_redaction_report.md")
        print(f"   - {Path(file_name).stem}_redaction_data.json")
        print(f"   - {Path(file_name).stem}_summary.txt")
        
        print("\n🔍 Redaction labels used:")
        counts = {}
        for instance in instances_to_redact:
            counts[instance['type']] = counts.get(instance['type'], 0) + 1
        
        for type_name, count in sorted(counts.items()):
            label = redactor.redaction_map.get(type_name, '[REDACTED]')
            print(f"   {label}: {count} ({type_name})")
        
        # Optional: Show preview of redacted content
        print("\n📄 Preview of redacted content (first 500 chars):")
        preview = redacted_content[:500]
        if len(redacted_content) > 500:
            preview += "..."
        print("-" * 50)
        print(preview)
        print("-" * 50)
        
    except KeyboardInterrupt:
        print("\n\nProcess interrupted by user.")
    except Exception as e:
        print(f"\nError processing file: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()