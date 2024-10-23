import pandas as pd
from sentence_transformers import SentenceTransformer,util
import pickle  # For saving/loading the embeddings



def load_generic_search_model(save_embeddings=False):
    # Load dataset
    df = pd.read_csv("./ml_models/DataSets/new+augumented_260.xls")
    required_columns = [
        "Facts",
        "Issues framed",
        "Decisions/Holdings",
        "Reasoning and Analysis",
        "Title",
    ]

    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        print("MISSINGGG")

    model = SentenceTransformer("bert-base-nli-mean-tokens")

    if save_embeddings:
        # Compute and save embeddings
        for col in required_columns:
            df[col + "_embedding"] = df[col].apply(
                lambda x: model.encode(str(x), convert_to_tensor=True)
            )

        # Save the DataFrame with embeddings to a file
        df.to_pickle("embeddings.pkl")
        print("Embeddings computed and saved.")
    else:
        # Load precomputed embeddings
        df = pd.read_pickle("embeddings.pkl")
        print("Embeddings loaded.")

    print("Model loaded and data ready.")
    return model, df, required_columns

def query_generic_search_model(model, df, required_columns, query, top_k=1):
    query_embeddings = model.encode(query, convert_to_tensor=True)

    selected_columns = required_columns

    all_hits = []
    for col in selected_columns:
        hits = util.semantic_search(
            query_embeddings, df[col + "_embedding"].tolist(), top_k=top_k
        )
        all_hits.extend(hits[0])

    unique_hits = {hit["corpus_id"]: hit for hit in all_hits}.values()
    sorted_hits = sorted(unique_hits, key=lambda x: x["score"], reverse=True)[:top_k]

    article_data_list = []

    for hit in sorted_hits:
        hit_id = hit["corpus_id"]
        article_data = df.iloc[hit_id]

        case_data = {
            "Title": article_data["Title"],
            "Facts": article_data["Facts"],
            "Issues_framed": article_data["Issues framed"],
            "Decisions_Holdings": article_data["Decisions/Holdings"],
            "Reasoning_and_Analysis": article_data["Reasoning and Analysis"],
            "result": article_data["Judgment Results"],
            "Date": article_data["Date"],
            "Judgement_Result": article_data["Judgment Results"]
        }
        article_data_list.append(case_data)

    return article_data_list

if __name__ == "__main__":
    model, df, required_columns = load_generic_search_model(save_embeddings=False)
    # model, df, required_columns = load_generic_search_model(save_embeddings=False)
    
    query = "trademark for food products"
    results = query_generic_search_model(model, df, required_columns, query)
    print(results)