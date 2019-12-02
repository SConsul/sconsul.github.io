---
layout: page
---

<h3><b>Semantic Segmentation of Medical Images</b></h3>

Summer Internship at Medical Deep Learning and AI Lab (MeDAL) IIT Bombay, Summer 2018

<h3>Lung Segmentation from Chest X Rays</h3>
[[Code]](https://github.com/MEDAL-IITB/Lung-Segmentation){:target="\_blank"}

With the widespread, prevalance of Chest X-Rays (CXRs) in medical diagnosis, CXRs contribute to a majority of the workload of radiologists and other medical practitioners. Thus, it becomes imperative to expedite the analysis of CXRs, with deep-learning being one possible method of automation.

![](./Flowchart_lungseg.PNG)
<p align="center"><em>Overview of Algorithm</em></p>

A variety of Fully Convolutional Networks (Global Convolutional Network, VGG UNet, SegNet, HDC/DUC and Mask R-CNN) were tested to segment the lungs from CXRs. A hybrid loss function, combining Soft Dice Loss, Soft Inverse Dice Loss, and Binary Cross-Entropy Loss (with logits), was employed to achieve the peak performance.

<!--Such work has direct appliciations in various diagnosis such as cardiomegaly (enlargement of the heart), pneumothorax (lung collapse), pleural effusion, emphysema, etc. Also this can act as an intermediary step in non-spatio-volumetric analysis like computer-aided detection of lung tumours from on CXR. -->

<h3>Nuclei Segmentation from Histopathological Images</h3>

![](./Flowchart_NucleusSeg.PNG)
<p align="center"><em>Overview of Algorithm</em></p>


I also worked on applying the same models to segment out Nuclei from h/he stained histopathological sections of various organs. The goal was to be able to generalise nuclei detection across various organs. Finetuning of the models along with conventional post-processing techniques enabled us to improve the state of the art results of nuclei segmentation to a F1 score to **85%**.
<!--This has direct appliciations in detection cancerous cells (eg. by getting a measure of the density of cells) in organs from their histopathology images. -->This work was used to host the [MoNuSeg](https://monuseg.grand-challenge.org/){:target="\_blank"} (Multi-Organ Nuclei-Segmentation) Challenge at [MICCAI 2018](https://www.miccai2018.org/en/){:target="\_blank"}. 


<h3>Screening of Precancerous Oral Lesions</h3>
Oral cancer is the deadliest form of cancer in India, due to the general poor oral hygiene combined with the lateness of symptoms. A user facing Android app was developed to screen patients and speed up remote diagnosis while reducing the workload of doctors. I annotated and pre-processed pictures of oral lesions from around 800 patients which was later used to train a Siamese Network classifier.
![](./oralcancer_ps.PNG)
<p align="center"><em>Overview of Algorithm</em></p>










