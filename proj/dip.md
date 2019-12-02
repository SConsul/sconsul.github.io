---
layout: page
---
<h3><b>Depth Map Estimation and Post Capture Image Refocusing</b></h3>

Course Project for CS663 - Digital Image Processing, Autumn 2018

team: with P. Khirwadkar and B. Dedhia

[[Final Presentation]](./dip.pdf){:target="\_blank"} 
[[Code]](https://github.com/SConsul/image-refocusing){:target="\_blank"}


The project was inspired from [Efficient Hybrid Tree-Based Stereo Matching With Applications to Postcapture Image Refocusing](http://minhdo.ece.illinois.edu/publications/TreeBasedStereoRefocus.pdf){:target="\_blank"} by Vu et. al.

In this project we emulated the refocusing effect present in modern smartphones using classical image processing and graph theory techniques. We developed an end to end algorithm which enables users to interactively select regions in images to focus and automatically generates the depth of view phenomenon. The entire pipeline can be broken down into two fundamental parts:

- Estimation depth from stereo images
- Refocusing system using an optics based model

Stereo images are pairs of images taken from slightly displaced cameras. This has to be done carefully to maintain the epipolar constraint. For this project the stereo images were obtained from the publically available Middlebury Dataset.
To obtain depth from the stero image pair, the two images have to be compared to obtained a per-pixel diparity. From trigonometry, it can be observed that the depth of the object is inversely proportional to the disparity.

The vanilla method to obtain stereo disparity assumes the prior information on the epipolar direction is given and fixed. For a more general procedure, the algorithm employed does not require this prior information. To reduce computation cost and speed up the process, a tree-based comparison has been employed. 

![](./overview_dip.png)
<p align="center"><em>Overview of the end-to-end pipeline</em></p>

This has been done in 2 stages: a pixel level comparison and a region level comparison. To obtain the regions, Simple Linear Iterative Clustering (SLIC) is employed. Cost is calculated as a weighted sum of the difference of intensity and gradient magnitude at a pixel, at a horizontal shift 'd' between the 2 pixels of the left and right image. Classical techniques would require computing this cost for every pixel, for every possible 'd' and then picking the d that minimizes the cost. The tree based approach aggregates this cost, with the underlying assumption that the cost of a distant pixel has little influence on the disparity decision while local pixel cost would influence the decision. Thus a minimum spanning tree is generated using Kruskal's Algorithm. Each brach is exponentially weighted by the spatial separation of the corresponding node region and the cost can be aggregated by 2 passes of the MST. 

<!--
![](./dip_cost_aggr.png)
<p align="center"><em>Cost Aggregation</em></p>
-->

The costs are adaptively fused using color and depth continuity to obtain the depth map. We post process the depth image using Mutual consistency check and Cross based local multipoint filtering. The final blurring is done using an adaptive Gaussian kernel calculated from the circle of confusion of the selected plane. 
The presentation describes the architecture and the intuitions behind the pipeline in detail. 

Shown below are the results over a couple of pictures from the Midlesbury dataset:
<p align="center"><em>Left: Original image, Right: Refocused image</em></p>
![](./1.jpg)

![](./2.jpg)

![](./3.jpg)


