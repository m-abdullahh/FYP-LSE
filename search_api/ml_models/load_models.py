tm_df = None
tm_embedder = None
tm_title_embeddings = None
tm_desc_embeddings = None

generic_model = None
generic_df = None
generic_required_columns = None

classifierSVM = None
classifierRF = None
classifierXG = None
vectorizer = None
label_encoder = None

from ml_models import load_judgement_classification_model

from ml_models import load_generic_search_model

from ml_models import load_trademark_model


def load_models():
    global tm_df, tm_embedder, tm_title_embeddings, tm_desc_embeddings
    global generic_model, generic_df, generic_required_columns
    global classifierSVM, classifierRF, classifierXG, vectorizer, label_encoder

    #! Load Generic Search Model
    generic_model, generic_df, generic_required_columns = load_generic_search_model()
    print("Generic Model Loaded")

    #! Load Trademark Model
    tm_df, tm_embedder, tm_title_embeddings, tm_desc_embeddings = load_trademark_model()
    print("Trademark Model Loaded")

    #! Load Judgement Classification Model
    classifierSVM, classifierRF, classifierXG, vectorizer, label_encoder = (
        load_judgement_classification_model()
    )
    print("Judgement Classification Model Loaded")
