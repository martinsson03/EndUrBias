"""
Simplified PII Redaction System
Focuses on reliability over complexity
"""
import re
from typing import List, Dict, Optional
from dataclasses import dataclass
from enum import Enum


class PIIType(Enum):
    """Types of PII we detect"""
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    SSN_SWEDISH = "SSN_SWEDISH"
    ADDRESS = "ADDRESS"
    POSTAL_CODE = "POSTAL_CODE"
    URL = "URL"
    PERSON = "PERSON"
    DATE = "DATE"
    APPLICANT_NAME = "APPLICANT_NAME"


@dataclass
class PIIMatch:
    """A single PII detection"""
    text: str
    start: int
    end: int
    pii_type: PIIType
    confidence: float
    source: str  # 'PATTERN' or 'PRESIDIO'
    
    def overlaps_with(self, other: 'PIIMatch') -> bool:
        """Check if this match overlaps with another"""
        return not (self.end <= other.start or self.start >= other.end)


class PatternRedactor:
    """Core pattern-based PII detection - simple and reliable"""
    
    # All patterns defined here
    PATTERNS = {
        PIIType.EMAIL: r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b',
        PIIType.SSN_SWEDISH: r'\b(?:19|20)?\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[-+]?\d{4}\b',
        # Phone numbers
        PIIType.PHONE: (
            # International format with +46 or 0046
            r'(?:\(?\+46\)?|\(?0046\)?)[\s\-]?'
            r'(?:'
                # Format: +46 7X XXX XX XX or +46 XX XXX XX XX
                r'[1-9][0-9]?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}|'
                # Format: +46 XXX XX XX XX (3-2-2-2)
                r'[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}|'
                # No spaces: +46 7XXXXXXXX or +46 XXXXXXXXX
                r'[0-9]{8,10}'
            r')|'
            # Format starting with 0
            r'0'
            r'(?:'
                # Format: 07X XXX XX XX or 0XX XXX XX XX
                r'[1-9][0-9]?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}|'
                # No spaces: 07XXXXXXXX or 0XXXXXXXXX
                r'[1-9][0-9]{7,9}'
            r')'
        ),
        # Postal codes
        PIIType.POSTAL_CODE: r'(?<![0-9\(\)])(?<!\+46[\s\-])(?<!0046[\s\-])\d{3}\s+\d{2}(?!\d)',
        PIIType.URL: r'\bhttps?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+\b',
        # Street addresses
       PIIType.ADDRESS: (
            r'\b[A-ZÅÄÖa-zåäö]+(?:gata|gatan|väg|vägen|gränd|gränden|allé|allén|torg|torget|gärde|gärdet)[\s\-]+\d{1,4}\b'
        ),
        }
    
    # Redaction labels
    REDACTION_LABELS = {
        PIIType.EMAIL: '[EMAIL]',
        PIIType.PHONE: '[PHONE]',
        PIIType.SSN_SWEDISH: '[SSN]',
        PIIType.ADDRESS: '[ADDRESS]',
        PIIType.POSTAL_CODE: '[POSTAL_CODE]',
        PIIType.URL: '[URL]',
        PIIType.PERSON: '[NAME]',
        PIIType.DATE: '[DATE]',
        PIIType.APPLICANT_NAME: '[NAME]',
    }
    
    def __init__(self):
        # Compile patterns for performance
        self.compiled_patterns = {
            pii_type: re.compile(pattern, re.IGNORECASE)
            for pii_type, pattern in self.PATTERNS.items()
        }
    
    def detect(self, text: str) -> List[PIIMatch]:
        """Detect all PII using regex patterns"""
        matches = []
        
        for pii_type, pattern in self.compiled_patterns.items():
            for match in pattern.finditer(text):
                matches.append(PIIMatch(
                    text=match.group(),
                    start=match.start(),
                    end=match.end(),
                    pii_type=pii_type,
                    confidence=1.0,  # Patterns are high confidence
                    source='PATTERN'
                ))
        
        return sorted(matches, key=lambda x: x.start)


class PresidioRedactor:
    """Optional Presidio integration for enhanced detection"""
    
    def __init__(self, language: str = "en"):  # English by default (No Swedish support)
        try:
            from presidio_analyzer import AnalyzerEngine
            
            # Initialize Presidio
            self.analyzer = AnalyzerEngine()
            self.language = "en"
            
            # Test if English works
            try:
                test_results = self.analyzer.analyze(
                    text="Test email test@example.com",
                    language="en",
                    score_threshold=0.1
                )
                print(f"✅ Presidio initialized with English language support")
            except Exception as e:
                print(f"⚠️  Presidio initialization warning: {e}")
                # Still continue, it might work with actual text
            
            self.available = True
            
        except ImportError:
            self.available = False
            print("⚠️  Presidio not installed. Install with: pip install presidio-analyzer")
        except Exception as e:
            print(f"❌ Failed to initialize Presidio: {e}")
            self.available = False
    
    def detect(self, text: str, confidence_threshold: float = 0.6) -> List[PIIMatch]:
        """Detect PII using Presidio (English only)"""
        if not self.available:
            return []
        
        try:
            # Always use English
            results = self.analyzer.analyze(
                text=text,
                language="en",
                score_threshold=confidence_threshold
            )
            
        except Exception as e:
            print(f"❌ Presidio detection failed: {e}")
            return []
        
        matches = []
        for result in results:
            # Map Presidio types to our types
            pii_type = self._map_presidio_type(result.entity_type)
            if pii_type:
                matches.append(PIIMatch(
                    text=text[result.start:result.end],
                    start=result.start,
                    end=result.end,
                    pii_type=pii_type,
                    confidence=float(result.score),
                    source='PRESIDIO'
                ))
        
        return matches
    
    def _map_presidio_type(self, presidio_type: str) -> Optional[PIIType]:
        """Map Presidio entity types to our PIIType enum"""
        mapping = {
            'PERSON': PIIType.PERSON,
            'EMAIL_ADDRESS': PIIType.EMAIL,
            'PHONE_NUMBER': PIIType.PHONE,
            'DATE_TIME': PIIType.DATE,
            'URL': PIIType.URL,
            'US_SSN': PIIType.SSN_SWEDISH,  # Generic SSN handling
        }
        return mapping.get(presidio_type)


class NameDetector:
    """Smart name detection for Swedish CVs"""
    
    def __init__(self, applicant_name: Optional[str] = None, use_spacy: bool = False):
        self.applicant_name = applicant_name
        self.applicant_parts = self._parse_name(applicant_name) if applicant_name else []
        self.use_spacy = use_spacy
        self.nlp = None
        
        # Load spaCy model if requested
        if use_spacy:
            try:
                import spacy
                try:
                    self.nlp = spacy.load("sv_core_news_sm")
                except OSError:
                    print("⚠️  Swedish spaCy model not found. Install with: python -m spacy download sv_core_news_sm")
                    self.use_spacy = False
            except ImportError:
                print("⚠️  spaCy not installed. Install with: pip install spacy")
                self.use_spacy = False
        
        # Common Swedish/Scandinavian name patterns for validation
        self.common_titles = {
            'mr', 'mrs', 'ms', 'dr', 'prof', 'ing', 'civ.ing', 
            'herr', 'fru', 'fröken'
        }
        
        # EXPANDED: Words that are NOT names (common false positives)
        self.stopwords = {
            # Swedish common words
            'och', 'att', 'det', 'som', 'är', 'för', 'med', 'på', 'av', 'till',
            'den', 'har', 'ett', 'inte', 'var', 'jag', 'en', 'han', 'ska', 'hon',
            'vi', 'de', 'detta', 'alla', 'vara', 'kan', 'från', 'vid', 'under',
            'hemsida', 'kompisar', 'tekniska'
            # English common words
            'and', 'the', 'for', 'with', 'from', 'have', 'this', 'that',
            # Tech/Dev tools - COMPREHENSIVE LIST
            'docker', 'kubernetes', 'linux', 'python', 'java', 'javascript', 
            'typescript', 'react', 'angular', 'vue', 'node', 'nodejs',
            'github', 'gitlab', 'bitbucket', 'azure', 'aws', 'gcp',
            'visual', 'studio', 'code', 'vscode', 'intellij', 'eclipse',
            'mysql', 'postgresql', 'mongodb', 'redis', 'kafka',
            'jenkins', 'terraform', 'ansible', 'git', 'svn',
            'windows', 'macos', 'ubuntu', 'debian', 'centos',
            'html', 'css', 'sql', 'bash', 'powershell',
            'slack', 'jira', 'confluence', 'trello', 'asana',
            'figma', 'sketch', 'adobe', 'photoshop', 'illustrator',
            'excel', 'word', 'powerpoint', 'outlook', 'teams',
            'chrome', 'firefox', 'safari', 'edge', 'opera',
            'android', 'ios', 'swift', 'kotlin', 'flutter',
            'webpack', 'babel', 'npm', 'yarn', 'pip',
            'spring', 'django', 'flask', 'express', 'fastapi',
            'junit', 'pytest', 'jest', 'mocha', 'selenium',
            'wireshark', 'nmap', 'metasploit', 'burp', 'kali',
            'postman', 'insomnia', 'swagger', 'grafana', 'prometheus',
            'splunk', 'elk', 'kibana', 'logstash', 'datadog', 'digiflisp'
            # Programming concepts
            'api', 'rest', 'graphql', 'grpc', 'soap', 'json', 'xml',
            'http', 'https', 'tcp', 'udp', 'ssh', 'ftp', 'smtp',
            'oauth', 'jwt', 'saml', 'ldap', 'active', 'directory',
            'microservices', 'serverless', 'devops', 'cicd', 'agile', 'scrum',
            # CV/Job terms
            'team', 'gruppchef', 'ledamot', 'student', 'intern', 'manager',
            'engineer', 'developer', 'analyst', 'consultant', 'architect',
            'senior', 'junior', 'lead', 'principal', 'staff',
            'fullstack', 'frontend', 'backend', 'devops', 'sre',
            # Companies (common ones)
            'google', 'microsoft', 'amazon', 'apple', 'meta', 'facebook',
            'ibm', 'oracle', 'salesforce', 'sap', 'cisco', 'intel',
            'volvo', 'scania', 'ericsson', 'spotify', 'klarna',
            # Universities
            'chalmers', 'kth', 'lund', 'uppsala', 'linköping', 'stockholm',
            'göteborgs', 'umeå', 'örebro', 'karlstad', 'växjö',
            'university', 'universitet', 'högskola', 'college',
            # Months
            'januari', 'februari', 'mars', 'april', 'maj', 'juni',
            'juli', 'augusti', 'september', 'oktober', 'november', 'december',
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december',
            # Cities (Swedish)
            'göteborg', 'stockholm', 'malmö', 'uppsala', 'västerås', 'örebro',
            'linköping', 'helsingborg', 'jönköping', 'norrköping', 'lund',
            'umeå', 'gävle', 'borås', 'eskilstuna', 'karlstad', 'växjö',
            'halmstad', 'sundsvall', 'luleå', 'trollhättan', 'kalmar',
        }
    
    def _parse_name(self, name: str) -> List[str]:
        """Parse name into parts for matching"""
        if not name:
            return []
        # Split and clean
        parts = [p.strip() for p in name.split()]
        return [p for p in parts if len(p) > 1]
    
    def detect(self, text: str) -> List[PIIMatch]:
        """Detect names in CV text"""
        matches = []
        lines = text.split('\n')
        
        # 1. Detect applicant name (if provided and appears in text)
        if self.applicant_name:
            matches.extend(self._find_applicant_name(text))
        
        # 2. Detect names from first few lines (CV header)
        matches.extend(self._detect_header_name(lines, text))
        
        # 3. Detect reference names (Referens: Name pattern)
        matches.extend(self._detect_reference_names(text))
        
        # 4. Use spaCy NLP if enabled (with aggressive filtering)
        if self.use_spacy and self.nlp:
            matches.extend(self._detect_spacy_names(text))
        
        # Remove duplicates/overlaps
        return self._deduplicate_matches(matches)
    
    def _find_applicant_name(self, text: str) -> List[PIIMatch]:
        """Find exact matches of the applicant name"""
        matches = []
        
        # Try exact match first
        for match in re.finditer(re.escape(self.applicant_name), text, re.IGNORECASE):
            matches.append(PIIMatch(
                text=match.group(),
                start=match.start(),
                end=match.end(),
                pii_type=PIIType.APPLICANT_NAME,
                confidence=1.0,
                source='NAME_APPLICANT'
            ))
        
        # Also try matching individual parts (first name, last name separately)
        for part in self.applicant_parts:
            if len(part) < 3:  # Skip initials
                continue
            
            # Word boundary match to avoid partial matches
            pattern = r'\b' + re.escape(part) + r'\b'
            for match in re.finditer(pattern, text, re.IGNORECASE):
                # Check if already covered by full name match
                overlaps = any(m.start <= match.start() < m.end or 
                             m.start < match.end() <= m.end 
                             for m in matches)
                if not overlaps:
                    matches.append(PIIMatch(
                        text=match.group(),
                        start=match.start(),
                        end=match.end(),
                        pii_type=PIIType.APPLICANT_NAME,
                        confidence=0.9,
                        source='NAME_APPLICANT_PART'
                    ))
        
        return matches
    
    def _detect_header_name(self, lines: List[str], full_text: str) -> List[PIIMatch]:
        """Detect name from CV header (first few lines)"""
        matches = []
        
        # Check first 3 non-empty lines
        checked_lines = 0
        for line in lines[:10]:
            line = line.strip()
            if not line or line.startswith('#'):
                # Skip empty and markdown headers
                if line.startswith('#'):
                    line = line.lstrip('#').strip()
                else:
                    continue
            
            # If we already have applicant name and this matches, skip
            if self.applicant_name and self.applicant_name.lower() in line.lower():
                checked_lines += 1
                continue
            
            # Check if line looks like a name
            if self._looks_like_name(line):
                # Find position in original text
                pos = full_text.find(line)
                if pos != -1:
                    matches.append(PIIMatch(
                        text=line,
                        start=pos,
                        end=pos + len(line),
                        pii_type=PIIType.PERSON,
                        confidence=0.85,
                        source='NAME_HEADER'
                    ))
            
            checked_lines += 1
            if checked_lines >= 3:
                break
        
        return matches
    
    def _detect_reference_names(self, text: str) -> List[PIIMatch]:
        """Detect names in reference sections"""
        matches = []
        
        # Pattern: "Referens:" or "Referens :" followed by a name
        # Also matches: "**Referens:**", "Reference:", etc.
        patterns = [
            r'(?:Referens|Reference)\s*:\s*\*?\*?([A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)+)',
            r'(?:Referens|Reference)\s*:\s*\*?\*?([A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)+)(?:\s*\([^)]+\))?',
            r'\*\*([A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)+)\*\*\s*\n\s*(?:TA Group Manager|System Engineer|Gruppchef|[A-Z])',
        ]
        
        for pattern in patterns:
            for match in re.finditer(pattern, text):
                name = match.group(1).strip()
                
                # Validate it's actually a name
                if self._looks_like_name(name):
                    # Find the exact position of the name in the text
                    name_start = match.start(1)
                    name_end = match.end(1)
                    
                    matches.append(PIIMatch(
                        text=name,
                        start=name_start,
                        end=name_end,
                        pii_type=PIIType.PERSON,
                        confidence=0.9,
                        source='NAME_REFERENCE'
                    ))
        
        return matches
    
    def _looks_like_name(self, text: str) -> bool:
        """Check if text looks like a person's name"""
        text = text.strip()
        
        # Basic checks
        if len(text) < 3 or len(text) > 50:
            return False
        
        # Should not contain numbers or special chars
        if re.search(r'[0-9@#$%^&*()+=\[\]{};:"|<>?/\\]', text):
            return False
        
        # Split into words
        words = text.split()
        
        # Should be 2-4 words (First Last, or First Middle Last)
        if len(words) < 2 or len(words) > 4:
            return False
        
        # Each word should start with capital letter
        if not all(w[0].isupper() for w in words if w):
            return False
        
        # Check against stopwords (case-insensitive)
        if any(w.lower() in self.stopwords for w in words):
            return False
        
        # Each word should be reasonable length
        if not all(2 <= len(w) <= 20 for w in words):
            return False
        
        return True
    
    def _detect_spacy_names(self, text: str) -> List[PIIMatch]:
        """Detect names using spaCy NER with aggressive filtering"""
        matches = []
        
        doc = self.nlp(text)
        
        for ent in doc.ents:
            # Only look at PERSON entities (Swedish models use PER or PRS)
            if ent.label_ not in ['PERSON', 'PER', 'PRS']:
                continue
            
            name = ent.text.strip()
            
            # Apply strict validation
            if not self._looks_like_name(name):
                continue
            
            # Additional filtering for spaCy results
            if self._is_likely_tech_term(name):
                continue
            
            # Check context - avoid names in skill lists
            if self._in_skill_section(text, ent.start_char):
                continue
            
            matches.append(PIIMatch(
                text=name,
                start=ent.start_char,
                end=ent.end_char,
                pii_type=PIIType.PERSON,
                confidence=0.75,
                source='NAME_SPACY'
            ))
        
        return matches
    
    def _is_likely_tech_term(self, text: str) -> bool:
        """Check if text is likely a technology/tool name"""
        lower = text.lower()
        words = lower.split()
        
        # Check if any word is a known tech term
        if any(word in self.stopwords for word in words):
            return True
        
        # Common patterns for tech terms
        tech_patterns = [
            r'.*[sS]tudio.*',  # Visual Studio, Android Studio
            r'.*[Cc]ode.*',    # VS Code, etc.
            r'.*[Ss]ystem.*',  # System Engineer (title, not name)
            r'.*[Gg]roup.*',   # Volvo Group
            r'.*[Tt]ech.*',    # Tech related
            r'.*\d+.*',        # Contains numbers
        ]
        
        for pattern in tech_patterns:
            if re.match(pattern, text):
                return True
        
        return False
    
    def _in_skill_section(self, text: str, position: int) -> bool:
        """Check if position is within a skills/tech section"""
        # Get surrounding context (500 chars before)
        context_start = max(0, position - 500)
        context = text[context_start:position].lower()
        
        # Skills section indicators
        skill_indicators = [
            'färdigheter', 'skills', 'teknisk', 'technical',
            'utvecklingsspråk', 'programming', 'languages',
            'utvecklingsmiljöer', 'tools', 'technologies',
            'kompetens', 'competence', 'erfarenhet av'
        ]
        
        # If we find skill indicators nearby, this is probably not a name
        for indicator in skill_indicators:
            if indicator in context:
                return True
        
        return False
    
    def _deduplicate_matches(self, matches: List[PIIMatch]) -> List[PIIMatch]:
        """Remove duplicate and overlapping matches, keep highest confidence"""
        if not matches:
            return []
        
        # Sort by start position, then by confidence (descending)
        sorted_matches = sorted(matches, key=lambda x: (x.start, -x.confidence))
        
        result = []
        for match in sorted_matches:
            # Check if this match overlaps with any already added
            overlaps = False
            for existing in result:
                if (match.start < existing.end and match.end > existing.start):
                    overlaps = True
                    break
            
            if not overlaps:
                result.append(match)
        
        return result


class PIIRedactor:
    """Main redaction pipeline - simple and focused"""
    
    def __init__(self, use_presidio: bool = False, language: str = "en",
                 applicant_name: Optional[str] = None, use_spacy_names: bool = False):
        self.pattern_redactor = PatternRedactor()
        self.name_detector = NameDetector(applicant_name=applicant_name, use_spacy=use_spacy_names)
        self.presidio_redactor = PresidioRedactor(language) if use_presidio else None
        self.use_presidio = use_presidio and (self.presidio_redactor and self.presidio_redactor.available)
        self.applicant_name = applicant_name
    
    def detect_pii(self, text: str) -> List[PIIMatch]:
        """Detect all PII in text"""
        all_matches = []
        
        # Step 1: Pattern matching (emails, phones, addresses - always reliable)
        pattern_matches = self.pattern_redactor.detect(text)
        all_matches.extend(pattern_matches)
        
        # Step 2: Name detection (smart, conservative)
        name_matches = self.name_detector.detect(text)
        all_matches.extend(name_matches)
        
        # Step 3: Presidio (optional, fills gaps)
        if self.use_presidio:
            presidio_matches = self.presidio_redactor.detect(text)
            
            # Only add Presidio matches that don't overlap with pattern/name matches
            for presidio_match in presidio_matches:
                if not any(presidio_match.overlaps_with(m) for m in all_matches):
                    all_matches.append(presidio_match)
        
        # Step 4: Remove overlapping matches (keep first/higher confidence)
        return self._remove_overlaps(sorted(all_matches, key=lambda x: x.start))
    
    def _remove_overlaps(self, matches: List[PIIMatch]) -> List[PIIMatch]:
        """Remove overlapping matches, keeping the first one"""
        if not matches:
            return []
        
        result = [matches[0]]
        for match in matches[1:]:
            # Check if this match overlaps with the last one we kept
            if not match.overlaps_with(result[-1]):
                result.append(match)
        
        return result
    
    def redact(self, text: str, matches: List[PIIMatch] = None) -> str:
        """Redact PII from text"""
        if matches is None:
            matches = self.detect_pii(text)
        
        # Apply redactions in reverse order to preserve positions
        redacted = text
        for match in sorted(matches, key=lambda x: x.start, reverse=True):
            label = PatternRedactor.REDACTION_LABELS.get(match.pii_type, '[REDACTED]')
            redacted = redacted[:match.start] + label + redacted[match.end:]
        
        return redacted
    
    def get_statistics(self, matches: List[PIIMatch]) -> Dict:
        """Get statistics about detected PII"""
        stats = {
            'total': len(matches),
            'by_type': {},
            'by_source': {}
        }
        
        for match in matches:
            # By type
            type_name = match.pii_type.value
            stats['by_type'][type_name] = stats['by_type'].get(type_name, 0) + 1
            
            # By source
            stats['by_source'][match.source] = stats['by_source'].get(match.source, 0) + 1
        
        return stats


def redact_text(text: str, use_presidio: bool = False, applicant_name: Optional[str] = None, use_spacy_names: bool = False) -> tuple[str, List[PIIMatch]]:
    """
    Quick API: Redact PII from text
    
    Args:
        text: Text to redact
        use_presidio: Enable Presidio detection (optional) - uses English
        applicant_name: Name of the CV applicant (will be redacted if found)
        use_spacy_names: Enable spaCy NER for additional name detection
    
    Returns:
        (redacted_text, list_of_matches)
    """
    redactor = PIIRedactor(
        use_presidio=use_presidio, 
        applicant_name=applicant_name, 
        use_spacy_names=use_spacy_names
    )
    matches = redactor.detect_pii(text)
    redacted = redactor.redact(text, matches)
    return redacted, matches
