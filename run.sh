#!/bin/bash

. venv/bin/activate


##############################################################################################################
##############################################################################################################
python generate_opacity_data.py
python generate_opacity_images.py

for ((i=1;i<=400;i++));
do
  if [ ! -f "data/opacity/opacity_$i.json"  ]; then
    echo "processing opacity topology $i"
    python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/opacity/opacity_$i.png > data/opacity/opacity_$i.json
  fi
done
python merge_json.py data/opacity/opacity_*.json > data/opacity/merged.json


##############################################################################################################
##############################################################################################################
python generate_points_data.py
python generate_points_images.py

for ((i=500;i<=70000;i+=500));
do
  if [ ! -f "data/points/points_$i.json"  ]; then
    echo "processing point count topology $i"
    python density-model.py --histogram_res_x 40 --histogram_res_y 40 --input data/points/points_$i.png > data/points/points_$i.json
  fi
done
python merge_json.py data/points/points_*.json > data/points/merged.json


##############################################################################################################
##############################################################################################################
#python distance-model.py


##############################################################################################################
##############################################################################################################
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_1.png > data/teaser_opacity/000_10_70000_0_7_1.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_5.png > data/teaser_opacity/000_10_70000_0_7_5.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_10.png > data/teaser_opacity/000_10_70000_0_7_10.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_50.png > data/teaser_opacity/000_10_70000_0_7_50.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_opacity/000_10_70000_0_7_100.png > data/teaser_opacity/000_10_70000_0_7_100.json


##############################################################################################################
##############################################################################################################
python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/teaser_point_count/000_7_500_20_7_100.png > data/teaser_point_count/000_7_500_20_7_100.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_point_count/000_7_2500_20_7_100.png > data/teaser_point_count/000_7_2500_20_7_100.json
python density-model.py --histogram_res_x 30 --histogram_res_y 30 --input data/teaser_point_count/000_7_12500_20_7_100.png > data/teaser_point_count/000_7_12500_20_7_100.json


##############################################################################################################
##############################################################################################################
python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/overdraw_ex/1_cropped.png > data/overdraw_ex/1_cropped.json
python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/overdraw_ex/10_cropped.png > data/overdraw_ex/10_cropped.json
python density-model.py --histogram_res_x 20 --histogram_res_y 20 --input data/overdraw_ex/100_cropped.png > data/overdraw_ex/100_cropped.json


deactivate
