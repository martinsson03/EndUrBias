import spacy
from spacy import displacy

nlp = spacy.load("en_core_web_sm")

with open ("data/wiki_mlk.txt", "r") as f:
    text = f.read()

doc = nlp(text)

displacy.serve(doc, style="ent")