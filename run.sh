#!/bin/bash

. venv/bin/activate

#python distance-model.py

python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/opacity/000_10_70000_0_7_1.png > data/opacity/000_10_70000_0_7_1.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/opacity/000_10_70000_0_7_5.png > data/opacity/000_10_70000_0_7_5.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/opacity/000_10_70000_0_7_10.png > data/opacity/000_10_70000_0_7_10.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/opacity/000_10_70000_0_7_50.png > data/opacity/000_10_70000_0_7_50.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/opacity/000_10_70000_0_7_100.png > data/opacity/000_10_70000_0_7_100.json

python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/point_count/000_7_500_20_7_100.png > data/point_count/000_7_500_20_7_100.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/point_count/000_7_2500_20_7_100.png > data/point_count/000_7_2500_20_7_100.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/point_count/000_7_12500_20_7_100.png > data/point_count/000_7_12500_20_7_100.json

cd data
python -m http.server --cgi 8088 &
sleep 1
python -m webbrowser -t "http://localhost:8088"

deactivate
