FROM python:3

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y libhdf5-serial-dev
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY 01-tsne.py ./
COPY 02-plot.py ./

CMD [ "python", "-u", "02-plot.py"]
