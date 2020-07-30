#!/bin/bash

. venv/bin/activate

mkdir demo/data/

##############################################################################################################
##############################################################################################################
python generate_opacity_data.py
python generate_opacity_images.py

for ((i=1;i<=400;i++));
do
  if [ ! -f "demo/data/opacity/opacity_$i.json"  ]; then
    echo "processing opacity topology $i"
    python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input demo/data/opacity/opacity_$i.png > demo/data/opacity/opacity_$i.json
  fi
done
python merge_json.py demo/data/opacity/opacity_*.json > demo/data/opacity/merged.json


##############################################################################################################
##############################################################################################################
python generate_points_data.py
python generate_points_images.py

for ((i=500;i<=70000;i+=500));
do
  if [ ! -f "demo/data/points/points_$i.json"  ]; then
    echo "processing point count topology $i"
    python density-model.py --histogram_res_x 40 --histogram_res_y 40 --input demo/data/points/points_$i.png > demo/data/points/points_$i.json
  fi
done
python merge_json.py demo/data/points/points_*.json > demo/data/points/merged.json


##############################################################################################################
##############################################################################################################
#python distance-model.py


##############################################################################################################
##############################################################################################################
mkdir demo/data/teaser_opacity/
cp data/teaser_opacity/*.png demo/data/teaser_opacity/
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_1.png > demo/data/teaser_opacity/000_10_70000_0_7_1.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_5.png > demo/data/teaser_opacity/000_10_70000_0_7_5.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_10.png > demo/data/teaser_opacity/000_10_70000_0_7_10.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_50.png > demo/data/teaser_opacity/000_10_70000_0_7_50.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_100.png > demo/data/teaser_opacity/000_10_70000_0_7_100.json


##############################################################################################################
##############################################################################################################
mkdir demo/data/teaser_points/
cp data/teaser_points/*.png demo/data/teaser_points/
python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/teaser_points/000_7_500_20_7_100.png > demo/data/teaser_points/000_7_500_20_7_100.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_points/000_7_2500_20_7_100.png > demo/data/teaser_points/000_7_2500_20_7_100.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_points/000_7_12500_20_7_100.png > demo/data/teaser_points/000_7_12500_20_7_100.json


##############################################################################################################
##############################################################################################################
mkdir demo/data/overdraw_fig/
cp data/overdraw_fig/*.png demo/data/overdraw_fig/
python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/overdraw_fig/1_cropped.png > demo/data/overdraw_fig/1_cropped.json
python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/overdraw_fig/10_cropped.png > demo/data/overdraw_fig/10_cropped.json
python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/overdraw_fig/100_cropped.png > demo/data/overdraw_fig/100_cropped.json

echo "Starting Demo Website"

cd demo
python3 -m http.server --cgi 8088

deactivate
