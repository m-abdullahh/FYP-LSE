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
)

from schemas import (
    JudgementClassificationSchema,
    GenericSearchSchema,
    TrademarkSearchSchema,
)

from ml_models import query_judgement_classification_model
from ml_models import query_trademark_model
from ml_models import query_generic_search_model

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