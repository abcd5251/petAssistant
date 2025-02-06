import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import PointStruct
from utils.constants import COLLECTION_NAME, EMBEDDING_MODEL, FILE_PATH
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tiktoken
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

client_openai = OpenAI()

def connection(embedding_size:int):

    client = QdrantClient(
        url=os.getenv("QDRANT_DB_URL"),
        api_key=os.getenv("QDRANT_APIKEY")
    )

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(
            distance=models.Distance.COSINE,
            size=embedding_size),
        optimizers_config=models.OptimizersConfigDiff(memmap_threshold=20000),
        hnsw_config=models.HnswConfigDiff(on_disk=True, m=16, ef_construct=100)
    )
    return client

def normalize_l2(x):
    x = np.array(x)
    if x.ndim == 1:
        norm = np.linalg.norm(x)
        if norm == 0:
            return x
        return x / norm
    else:
        norm = np.linalg.norm(x, 2, axis=1, keepdims=True)
        return np.where(norm == 0, x, x / norm)

def upsert_vector(client, vectors, data):
    for i, vector in enumerate(vectors):
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=[PointStruct(id=i,
                                vector=vectors[i],
                                payload=data[i])]
        )
    print("upsert finish")

def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

def get_embedding(text, model=EMBEDDING_MODEL):
    response = client_openai.embeddings.create(
        input=text,
        model=model,
        encoding_format="float"
    )
    return response.data[0].embedding

def get_client():
    return QdrantClient(
        url=os.getenv("QDRANT_DB_URL"),
        api_key=os.getenv("QDRANT_APIKEY")
    )

def search_from_qdrant(client, vector, k):
    search_result = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=vector,
        limit=k,
        append_payload=True,
    )
    return search_result

def main():

    with open(FILE_PATH) as f:
        contents = f.read()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
        length_function=len,
        separators=[
        "\n\n",
        "\n",
        "."],
        is_separator_regex=False,
    )
    docs = text_splitter.create_documents([contents])
    
    data_objs = []
    embedding_array = []
    for i in range(len(docs)):
        vector = get_embedding(docs[i].page_content)
        embedding_array.append(vector)
        data_objs.append({"id" : i, "content" : docs[i].page_content})

    qclient = connection(embedding_size=len(vector))
    upsert_vector(qclient, embedding_array, data_objs)

if __name__ == "__main__":
    main()