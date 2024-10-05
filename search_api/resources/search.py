from flask.views import MethodView
from flask_smorest import Blueprint

from ml_models.load_models import (
    tm_df,
    tm_embedder,
    tm_title_embeddings,
    tm_desc_embeddings,
    generic_model,
    generic_df,
    generic_required_columns,
    classifierSVM,
    classifierRF,
    classifierXG,
    vectorizer,
    label_encoder,

    #NAIVE BAYES MODEL
    nb_classifier,
    nb_vectorizer,

    #GEMINI MODEL
    gemini_model
)

from ml_models import query_judgement_classification_model
from ml_models import query_trademark_model
from ml_models import query_generic_search_model
from ml_models import run_query,extract_integer
from ml_models import process_query_with_gemini
from schemas import (
    JudgementClassificationSchema,
    GenericSearchSchema,
    TrademarkSearchSchema,ChatBotSchema
)

def perform_search(query, prediction, generic_model, generic_df, generic_required_columns, 
                   tm_df, tm_embedder, tm_title_embeddings, tm_desc_embeddings):
    if prediction == "Case Search":
        # Call Generic Search Model query
        results = query_generic_search_model(generic_model, generic_df, generic_required_columns, query)
        return results

    elif prediction == "Trademark Ordinance Search":
        # Call Trademark Model query
        results = query_trademark_model(query, tm_df, tm_embedder, tm_title_embeddings, tm_desc_embeddings, "text")
        return results

    elif prediction == "Search by Section Number":
        # Extract any integer (assumed to be a section number) using regex
        section_no = int(extract_integer(query))
        if section_no:
            print(f"Extracted Number: {section_no}")
            # Call Trademark Model query by section number
            query = section_no
            results = query_trademark_model(query, tm_df, tm_embedder, tm_title_embeddings, tm_desc_embeddings, "section_no")
            return results
        else:
            return "No number found in the query."


blp = Blueprint(
    "searches",
    __name__,
    description="Operations of Searches",
    url_prefix="/search",
)


#! Generic Search Model route
@blp.route("/genericsearch")
class GenericSearch(MethodView):
    @blp.arguments(GenericSearchSchema, location='query')
    def get(self, search_data):
        query = search_data.get("text")
        if not query:
            return {"error": "No text query provided"}, 400

        results = query_generic_search_model(
            generic_model, generic_df, generic_required_columns, query
        )
        return results


#! Trademark Search Model route
@blp.route("/trademarksearch")
class TrademarkSearch(MethodView):
    @blp.arguments(TrademarkSearchSchema, location='query')
    def get(self, search_data):
        text = search_data.get("text")
        section_no = search_data.get("section_no")
        query_type = search_data.get("query_type")
        
        print(text, section_no, query_type)
        # Determine the query based on query_type
        query = section_no if query_type == "section_no" else text

        results = query_trademark_model(
            query,
            tm_df,
            tm_embedder,
            tm_title_embeddings,
            tm_desc_embeddings,
            query_type,
        )
        return results


#! Judgement Classification Prediction Model route
@blp.route("/judgementclassification")
class JudgementClassification(MethodView):
    @blp.arguments(JudgementClassificationSchema, location='query')
    def get(self, search_data):
        query = search_data.get("text")
        if not query:
            return {"error": "No text query provided"}, 400

        result = query_judgement_classification_model(
            query,
            "svm",
            classifierSVM,
            classifierRF,
            classifierXG,
            vectorizer,
            label_encoder,
        )
        return {"result": result}
    
#! Chatbot API
@blp.route("/chatbot")
class ChatBot(MethodView):
    @blp.arguments(ChatBotSchema, location='query')
    def get(self, search_data):
        query = search_data.get("text")
        if not query:
            return {"error": "No text query provided"}, 400

        

        prediction = run_query(query,nb_classifier, nb_vectorizer)

        gemini_query = perform_search(query, prediction, generic_model, generic_df, generic_required_columns, 
                   tm_df, tm_embedder, tm_title_embeddings, tm_desc_embeddings)
        
        result = process_query_with_gemini(gemini_query, gemini_model)
        return {"result": result}