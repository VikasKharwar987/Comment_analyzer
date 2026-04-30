import os
import json
import pandas as pd
import torch
import mlflow
import mlflow.pytorch

from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)

from sklearn.metrics import accuracy_score, precision_recall_fscore_support


# ---------------- CONFIG ----------------
MODEL_NAME = "distilbert-base-uncased"
MAX_LEN = 128
BATCH_SIZE = 16
EPOCHS = 2


# ---------------- METRICS ----------------
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = logits.argmax(axis=1)

    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, preds, average="binary"
    )
    acc = accuracy_score(labels, preds)

    return {
        "accuracy": acc,
        "f1": f1,
        "precision": precision,
        "recall": recall
    }

def load_data():
    df = pd.read_csv("./data/train.csv", engine="python", on_bad_lines="skip")

    labels = ['toxic','severe_toxic','obscene','threat','insult','identity_hate']
    df['label'] = (df[labels].sum(axis=1) > 0).astype(int)

    return df[['comment_text','label']].dropna()


class ToxicDataset(torch.utils.data.Dataset):
    def __init__(self, texts, labels, tokenizer):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        enc = self.tokenizer(
            str(self.texts[idx]),
            truncation=True,
            padding="max_length",
            max_length=MAX_LEN,
            return_tensors="pt"
        )

        item = {k: v.squeeze(0) for k, v in enc.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item


def train():

    mlflow.set_experiment("toxicity-model")

    with mlflow.start_run(run_name="v1_baseline"):

        df = load_data()

        train_df = df.sample(frac=0.9, random_state=42)
        val_df = df.drop(train_df.index)

        tokenizer = DistilBertTokenizer.from_pretrained(MODEL_NAME)

        train_dataset = ToxicDataset(train_df.comment_text.tolist(), train_df.label.tolist(), tokenizer)
        val_dataset = ToxicDataset(val_df.comment_text.tolist(), val_df.label.tolist(), tokenizer)

        model = DistilBertForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=2)

        training_args = TrainingArguments(
            output_dir="./results",
            num_train_epochs=EPOCHS,
            per_device_train_batch_size=BATCH_SIZE,
            per_device_eval_batch_size=BATCH_SIZE,
            eval_strategy="epoch"
        )

        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            compute_metrics=compute_metrics
        )

        trainer.train()
        metrics = trainer.evaluate()


        mlflow.log_metric("accuracy", metrics["eval_accuracy"])
        mlflow.log_metric("f1_score", metrics["eval_f1"])
        mlflow.log_metric("precision", metrics["eval_precision"])
        mlflow.log_metric("recall", metrics["eval_recall"])

        model.save_pretrained("models/v1")
        tokenizer.save_pretrained("models/v1")

        metadata = {
            "version": "v1",
            "accuracy": metrics["eval_accuracy"],
            "f1_score": metrics["eval_f1"],
            "precision": metrics["eval_precision"],
            "recall": metrics["eval_recall"]
        }

        with open("models/v1/metadata.json", "w") as f:
            json.dump(metadata, f, indent=4)

        print("✅ Baseline model (v1) saved")


if __name__ == "__main__":
    train()