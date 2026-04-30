from predict import predict

texts = [
    "You are stupid",
    "I love this content",
    "Go kill yourself",
    "motherfucker shup up"
]

for t in texts:
    print(t, "->", predict(t))