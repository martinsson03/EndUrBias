"""
Simple file-based test script for PII redaction
Run with: python test_files.py
"""
import sys
from pathlib import Path
from typing import List, Dict, Optional
import json
from datetime import datetime

# Import the redactor
try:
    from pii_redactor import PIIRedactor, PIIMatch, PIIType
except ImportError:
    print("❌ Could not import pii_redactor.py")
    print("Make sure pii_redactor.py is in the same directory")
    sys.exit(1)


class FileTestResult:
    """Results from testing a single file"""
    def __init__(self, file_path: Path, matches: List[PIIMatch], redacted_text: str, original_text: str):
        self.file_path = file_path
        self.matches = matches
        self.redacted_text = redacted_text
        self.original_text = original_text
        self.timestamp = datetime.now().isoformat()
    
    def get_statistics(self) -> Dict:
        """Get statistics about detected PII"""
        stats = {
            'file': str(self.file_path),
            'timestamp': self.timestamp,
            'original_size': len(self.original_text),
            'total_pii': len(self.matches),
            'by_type': {},
            'by_source': {},
            'matches': []
        }
        
        for match in self.matches:
            # By type
            type_name = match.pii_type.value
            stats['by_type'][type_name] = stats['by_type'].get(type_name, 0) + 1
            
            # By source
            stats['by_source'][match.source] = stats['by_source'].get(match.source, 0) + 1
            
            # Individual matches
            stats['matches'].append({
                'type': match.pii_type.value,
                'text': match.text,
                'start': match.start,
                'end': match.end,
                'confidence': match.confidence,
                'source': match.source
            })
        
        return stats


def test_single_file(file_path: Path, redactor: PIIRedactor, output_dir: Path, applicant_name: Optional[str] = None) -> FileTestResult:
    """Test redaction on a single file"""
    print(f"\n{'='*70}")
    print(f"📄 Testing: {file_path.name}")
    print(f"{'='*70}")
    
    # Read file
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return None
    
    print(f"  Size: {len(content)} characters")
    
    # Detect PII
    print(f"  🔍 Detecting PII...")
    matches = redactor.detect_pii(content)
    
    # Redact
    redacted = redactor.redact(content, matches)
    
    # Print results
    print(f"\n  📊 Results:")
    print(f"    Total PII found: {len(matches)}")
    
    if matches:
        # Group by type
        by_type = {}
        for match in matches:
            type_name = match.pii_type.value
            by_type[type_name] = by_type.get(type_name, 0) + 1
        
        print(f"\n    By Type:")
        for pii_type, count in sorted(by_type.items()):
            print(f"      {pii_type}: {count}")
        
        # Show first few matches as examples
        print(f"\n    🔍 Sample detections (first 5):")
        for i, match in enumerate(matches[:5], 1):
            preview = match.text[:50] + "..." if len(match.text) > 50 else match.text
            print(f"      {i}. {match.pii_type.value}: '{preview}' [{match.source}]")
        
        if len(matches) > 5:
            print(f"      ... and {len(matches) - 5} more")
    
    # Save outputs
    output_dir.mkdir(exist_ok=True)
    
    # Save redacted file
    redacted_path = output_dir / f"redacted_{file_path.name}"
    with open(redacted_path, 'w', encoding='utf-8') as f:
        f.write(redacted)
    print(f"\n  💾 Redacted file: {redacted_path}")
    
    # Save match details as JSON
    result = FileTestResult(file_path, matches, redacted, content)
    stats = result.get_statistics()
    
    json_path = output_dir / f"pii_report_{file_path.stem}.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    print(f"  💾 PII report: {json_path}")
    
    # Show preview of redacted content
    print(f"\n  📝 Redacted preview (first 300 chars):")
    print(f"  {'-'*66}")
    preview = redacted[:300].replace('\n', '\n  ')
    print(f"  {preview}...")
    print(f"  {'-'*66}")
    
    return result


def test_all_files_in_directory(data_dir: Path, redactor: PIIRedactor, output_dir: Path, applicant_name: Optional[str] = None) -> List[FileTestResult]:
    """Test all markdown files in a directory"""
    print(f"\n{'='*70}")
    print(f"🗂️  Testing all files in: {data_dir}")
    print(f"{'='*70}")
    
    # Find all markdown files
    md_files = list(data_dir.glob("*.md"))
    
    if not md_files:
        print(f"❌ No .md files found in {data_dir}")
        return []
    
    print(f"Found {len(md_files)} markdown files:")
    for f in md_files:
        print(f"  - {f.name}")
    
    # Test each file
    results = []
    for file_path in md_files:
        result = test_single_file(file_path, redactor, output_dir, applicant_name)
        if result:
            results.append(result)
    
    return results


def print_summary(results: List[FileTestResult]):
    """Print summary of all test results"""
    print(f"\n{'='*70}")
    print(f"📊 SUMMARY - Tested {len(results)} files")
    print(f"{'='*70}")
    
    total_pii = sum(len(r.matches) for r in results)
    
    # Aggregate by type across all files
    all_by_type = {}
    all_by_source = {}
    
    for result in results:
        for match in result.matches:
            type_name = match.pii_type.value
            all_by_type[type_name] = all_by_type.get(type_name, 0) + 1
            all_by_source[match.source] = all_by_source.get(match.source, 0) + 1
    
    print(f"\nTotal PII instances detected: {total_pii}")
    
    print(f"\nBy Type (across all files):")
    for pii_type, count in sorted(all_by_type.items(), key=lambda x: x[1], reverse=True):
        print(f"  {pii_type}: {count}")
    
    print(f"\nBy Source:")
    for source, count in sorted(all_by_source.items()):
        print(f"  {source}: {count}")
    
    print(f"\nPer-file breakdown:")
    for result in results:
        print(f"  {result.file_path.name}: {len(result.matches)} PII instances")


def interactive_mode(data_dir: Path, output_dir: Path):
    """Interactive mode for testing files"""
    print("\n" + "="*70)
    print("🧪 PII REDACTOR - FILE TESTER")
    print("="*70)
    
    # Check if data directory exists
    if not data_dir.exists():
        print(f"❌ Data directory not found: {data_dir}")
        print(f"Creating directory: {data_dir}")
        data_dir.mkdir(parents=True)
        print(f"Please add .md files to {data_dir} and run again")
        return
    
    # Ask about Presidio
    use_presidio_input = input("\nUse Presidio for enhanced detection? (y/n) [n]: ").strip().lower()
    use_presidio = use_presidio_input == 'y'
    
    # Ask for applicant name
    applicant_name = input("Enter applicant name (optional, for name detection): ").strip() or None
    
    redactor = PIIRedactor(use_presidio=use_presidio, applicant_name=applicant_name)
    print(f"✅ Redactor initialized (Presidio: {'enabled' if use_presidio else 'disabled'})")
    if applicant_name:
        print(f"✅ Will redact applicant name: {applicant_name}")
    
    # Show available files
    md_files = list(data_dir.glob("*.md"))
    
    if not md_files:
        print(f"\n❌ No .md files found in {data_dir}")
        print("Please add some markdown files to test")
        return
    
    print(f"\n📁 Found {len(md_files)} markdown files in {data_dir}:")
    for i, f in enumerate(md_files, 1):
        size_kb = f.stat().st_size / 1024
        print(f"  {i}. {f.name} ({size_kb:.1f} KB)")
    
    # Ask what to test
    print(f"\nOptions:")
    print(f"  'all' - Test all files")
    print(f"  '1-{len(md_files)}' - Test a specific file by number")
    print(f"  'filename.md' - Test a specific file by name")
    
    choice = input(f"\nYour choice [all]: ").strip() or "all"
    
    results = []
    
    if choice.lower() == 'all':
        results = test_all_files_in_directory(data_dir, redactor, output_dir, applicant_name)
    elif choice.isdigit() and 1 <= int(choice) <= len(md_files):
        file_path = md_files[int(choice) - 1]
        result = test_single_file(file_path, redactor, output_dir, applicant_name)
        if result:
            results.append(result)
    else:
        file_path = data_dir / choice
        if file_path.exists():
            result = test_single_file(file_path, redactor, output_dir, applicant_name)
            if result:
                results.append(result)
        else:
            print(f"❌ File not found: {file_path}")
            return
    
    # Print summary if multiple files
    if len(results) > 1:
        print_summary(results)
    
    print(f"\n✅ Testing complete!")
    print(f"📂 All outputs saved to: {output_dir}")


def main():
    """Main CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Test PII Redactor on files")
    parser.add_argument('--data-dir', type=str, default='data', 
                       help='Directory containing files to test (default: data)')
    parser.add_argument('--output-dir', type=str, default='output',
                       help='Directory for output files (default: output)')
    parser.add_argument('--presidio', action='store_true', 
                       help='Enable Presidio detection')
    parser.add_argument('--applicant-name', type=str, dest='applicant_name',
                       help='Name of the CV applicant to redact')
    parser.add_argument('--all', action='store_true',
                       help='Test all files without prompting')
    parser.add_argument('--file', type=str,
                       help='Test a specific file')
    
    args = parser.parse_args()
    
    data_dir = Path(args.data_dir)
    output_dir = Path(args.output_dir)
    
    # Non-interactive modes
    if args.all or args.file:
        redactor = PIIRedactor(use_presidio=args.presidio, applicant_name=args.applicant_name)
        
        if args.file:
            file_path = Path(args.file)
            if not file_path.exists():
                print(f"❌ File not found: {file_path}")
                sys.exit(1)
            test_single_file(file_path, redactor, output_dir, args.applicant_name)
        else:
            results = test_all_files_in_directory(data_dir, redactor, output_dir, args.applicant_name)
            if len(results) > 1:
                print_summary(results)
    else:
        # Interactive mode
        interactive_mode(data_dir, output_dir)


if __name__ == "__main__":
    main()