---
layout: projectpage
title: DSP-AA
cardtitle: Human Detection from LWIR Imagery
fulltitle: Human Detection from Post-disaster LWIR Imagery
description: DIGITAL SIGNAL PROCESSING
fulldescription: Course Project for EE338 - Digital Signal Processing, Spring 2019
team: with P. Khirwadkar, B. Dedhia and K. Porlikar
year: 2019
img: /assets/img/dsp-aa_result_still.PNG
---

[[Code]](https://github.com/SConsul/Human-Detction-from-LWIR-Images){:target="\_blank"}

<div class="img_row">
    <img class="col one left" src="{{ site.baseurl }}/assets/img/dsp-aa_result1.gif" alt="" title="Results"/>
    <img class="col one left" src="{{ site.baseurl }}/assets/img/dsp-aa_result3.png" alt="" title="Results"/>
    <img class="col one left" src="{{ site.baseurl }}/assets/img/dsp-aa_result2.gif" alt="" title="Results"/>
</div>
<div class="col three caption">
    You can also have artistically styled 2/3 + 1/3 images, like these.
</div>



LWIR imagery is desirable compared to conventional light imaging owing to robustness against occlusion and illumination variation. The aim of this project was to build a human detection tool for LWIR imagery to enable drone based reconnaissance and achieve safer and faster rescue.

The pipeline of the tool was as follows:

1. Compute the hotspot regions by calculating Maximally Stable Extremal regions (MSER)

2. Resize the hotspots to a fixed dimension and extract Histogram of gradients, Integrated Channel features and Discrete Cosine transform to build a 2000 feature vector

3.  A support vector machine is trained on the groundtruth vectors containing labelled hotspots to detect humans.

The tool was trained on the OTCBVS datset. We achieved a 98.79 % test acccuracy against the OTCBVS dataset and the model worked flawlessly for real-world LWIR disaster images containing a considerable amount of obstructions and illumination variance.


<div class="img_blog">
    <img class="col three left" src="{{ site.baseurl }}/assets/img/dsp-aa_flowchart.png" alt="" title="Flow Chart"/>
</div>
<div class="col three caption">
    Overview of the system
</div>
This project was supported by the Prof. Vikram M. Gadre, dept. of Electrical Engg. IIT Bombay in part of the TEQIP-III Program, 2019a

