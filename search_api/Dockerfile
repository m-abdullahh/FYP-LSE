FROM python:3.12
EXPOSE 5000
WORKDIR /app
COPY requirements.txt .
ENV PIP_DEFAULT_TIMEOUT=1000
RUN pip install -r requirements.txt
COPY . .
CMD ["flask", "run", "--host","0.0.0.0"]