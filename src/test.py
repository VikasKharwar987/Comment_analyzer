# from transformers import pipeline

# classifier = pipeline(
#     "text-classification",
#     model="toxicity_xlmr",
#     tokenizer="toxicity_xlmr"
# )

# def predict(text):
#     result = classifier(text)[0]

#     label_map = {
#         "LABEL_0": "SAFE",
#         "LABEL_1": "TOXIC"
#     }

#     return {
#         "text": text,
#         "prediction": label_map[result["label"]],
#         "confidence": result["score"]
#     }
from huggingface_hub import login, upload_folder
# print(predict("teri maa ki chut"))
login()
upload_folder(folder_path="toxicity_xlmr", repo_id="Kharwar1011/XLMR_model", repo_type="model")