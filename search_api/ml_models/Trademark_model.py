import pandas as pd
from sentence_transformers import SentenceTransformer, util


def load_trademark_model():
    # Load the dataset
    df = pd.read_csv("./ml_models/DataSets/complete trade-mark ordinance dataset.csv")

    # Fill NaN values
    df = df.fillna("")
    df["id"] = df.index

    # Initialize the SentenceTransformer model
    embedder = SentenceTransformer("nlpaueb/legal-bert-base-uncased")

    # Encode the corpus (both title and subsec_desc)
    title_embeddings = embedder.encode(df["title"], convert_to_tensor=True)
    desc_embeddings = embedder.encode(df["subsec_desc"], convert_to_tensor=True)

    return df, embedder, title_embeddings, desc_embeddings


def query_trademark_model(
    query, df, embedder, title_embeddings, desc_embeddings, query_type
):
    if query_type == "section_no":
        q = df[df["sect_no"] == query]
        return q.to_dict(orient="records")
    else:
        top_k = 5
        query_embedding = embedder.encode(query, convert_to_tensor=True)
        title_hits = util.semantic_search(
            query_embedding, title_embeddings, top_k=top_k
        )
        desc_hits = util.semantic_search(query_embedding, desc_embeddings, top_k=top_k)

        hits = title_hits[0] + desc_hits[0]
        hits = sorted(hits, key=lambda x: x["score"], reverse=True)[:top_k]

        results = []
        for hit in hits:
            hit_id = hit["corpus_id"]
            article_data = df.iloc[hit_id]
            results.append(article_data.to_dict())
        return results


if __name__ == "__main__":
    query = 50
    query_type = "section"
    df, embedder, title_embeddings, desc_embeddings = load_trademark_model()
    result = query_trademark_model(
        query, df, embedder, title_embeddings, desc_embeddings, query_type
    )
    print(result)