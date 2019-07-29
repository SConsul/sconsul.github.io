---
layout: projectpage
title: Semantic Segmentation of Medical Images
cardtitle: Semantic Segmentation of Medical Images
fulltitle: Semantic Segmentation of Medical Images
description: MedAL
fulldescription: Summer Internship, Summer 2018
<!--team: P. Khirwadkar, A. Prasad and D. Gopalan-->
year: 2018
img: /assets/img/lung.png
---

<h3>Lung Segmentation from Chest X Rays</h3>
[[Code]](https://github.com/MEDAL-IITB/Lung-Segmentation){:target="\_blank"}

With the widespread, prevalance of Chest X-Rays (CXRs) in medical diagnosis, CXRs contribute to a majority of the workload of radiologists and other medical practitioners. Thus, it becomes imperative to expedite the analysis of CXRs, with deep-learning being one possible method of automation.

<div class="img_blog">
    <img class="col three left" src="{{ site.baseurl }}/assets/img/Flowchart_lungseg.PNG" alt="" title="Overview of Algorithm"/>
</div>
<div class="col three caption">
    Overview of the Algorithm
</div>

A variety of Fully Convolutional Networks (Global Convolutional Network, VGG UNet, SegNet, HDC/DUC and Mask R-CNN) were tested to segment the lungs from CXRs. A hybrid loss function, combining Soft Dice Loss, Soft Inverse Dice Loss, and Binary Cross-Entropy Loss (with logits), was employed to achieve the peak performance.

<!--Such work has direct appliciations in various diagnosis such as cardiomegaly (enlargement of the heart), pneumothorax (lung collapse), pleural effusion, emphysema, etc. Also this can act as an intermediary step in non-spatio-volumetric analysis like computer-aided detection of lung tumours from on CXR. -->

<h3>Nuclei Segmentation from Histopathological Images</h3>

<div class="img_blog">
    <img class="col three left" src="{{ site.baseurl }}/assets/img/Flowchart_NucleusSeg.PNG" alt="" title="Overview of Algorithmk"/>
</div>
<div class="col three caption">
   Overview of the Algorithm
</div>

I also worked on applying the same models to segment out Nuclei from h/he stained histopathological sections of various organs. The goal was to be able to generalise nuclei detection across various organs. Finetuning of the models along with conventional post-processing techniques enabled us to improve the state of the art results of nuclei segmentation to a F1 score to **85%**.
{: .text-justify}
<!--This has direct appliciations in detection cancerous cells (eg. by getting a measure of the density of cells) in organs from their histopathology images. -->This work was used to host the MoNuSeg (Multi-Organ Nuclei-Segmentation) Challenge at [MICCAI 2018](https://www.miccai2018.org/en/){:target="\_blank"}. 

<!--For this project, we used [Demixing Secrets Dataset 100 (DSD100)](https://sigsep.github.io/datasets/dsd100.html){:target="\_blank"} for training and testing purposes. -->
