# -*- coding: utf-8 -*-
import requests
import json
import urllib.parse

PROJECT_ID = "onxd36ek"
DATASET = "production"
TOKEN = "skWJsnmyBzOJdg9WKmpF2bcmE01krZGkASWlLqKFH1hRy2gu5Uwd0zju3kRY5toF04MCtfe476SbnZQp6qYFBPl7lZ2fVQF7JGi0Ne414PWrwJyA4KJk0Mf1LyfDhR53lTZzwh8N4kR61LrSXdncboqyiFuQ1YLC1BeLn2vMuZoRQaI5Itwz"
API_BASE = f"https://{PROJECT_ID}.api.sanity.io/v2024-01-01"
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

# Fetch full document (not just body)
query = '*[_type == "post" && slug.current == "o-que-cabe-em-50m-comparacao-entre-casas-compactas-com-apartamentos-convencionais"][0]'
encoded = urllib.parse.quote(query)
url = f"{API_BASE}/data/query/{DATASET}?query={encoded}"
resp = requests.get(url, headers=HEADERS)
doc = resp.json().get("result", {})

# Show all keys
print("Document keys:", list(doc.keys()))

# Dump full body
body = doc.get("body", [])
print(f"\nTotal blocks: {len(body)}")

# Full dump to search for Glasgow etc
full_dump = json.dumps(body, ensure_ascii=False)
for term in ["Glasgow", "glasgow", "Ribeira", "ribeira", "Lagos", "lagos", "Londres", "londres"]:
    if term in full_dump:
        idx = full_dump.index(term)
        print(f"\nFound '{term}' at position {idx}: ...{full_dump[max(0,idx-100):idx+100]}...")
    else:
        print(f"'{term}' NOT in body JSON")

# Also search full document dump
full_doc = json.dumps(doc, ensure_ascii=False)
for term in ["Glasgow", "Ribeira Brava", "Lagos", "Londres"]:
    if term in full_doc:
        idx = full_doc.index(term)
        print(f"\nIn full doc, found '{term}': ...{full_doc[max(0,idx-80):idx+80]}...")
