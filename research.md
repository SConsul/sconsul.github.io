---
layout: page
title: Research
permalink: /research/
---
<!--<img style="float: center" src="calvin.png">-->
<!--<img style="float: center" src="queen_eliz.png">-->
<script>
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  },
  svg: {
    fontCache: 'global'
  }
};
</script>
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js">
</script>

<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js">
</script>
## **Publications**

# 2020
<div markdown="1" onmouseover="document.getElementById('pi').style.display='block';" onmouseout="document.getElementById('pi').style.display='none';">
**Lower Bounds for Policy Iteration on Multi-action MDPs**<br/>
[Kumar Ashutosh](https://thechargedneutron.github.io/){:target="\_blank"}<sup>*</sup>, 
_Sarthak Consul_<sup>*</sup>, 
[Bhishma Dedhia](https://glitchinthematrix.github.io/){:target="\_blank"}<sup>*</sup>, [
Parthasarathi Khirwadkar](https://scholar.google.com/citations?user=6i8AefAAAAAJ&hl=en){:target="\_blank"}<sup>*</sup>, 
[Sahil Shah](https://www.cse.iitb.ac.in/~sahilshah/){:target="\_blank"}<sup>*</sup>, 
[Shivaram Kalyanakrishnan](https://www.cse.iitb.ac.in/~shivaram/){:target="\_blank"}<sup>*</sup><br/>
IEEE Conference on Decision and Control 2020 <sub><sup>*Equal Contributions</sup></sub><br/>
[Paper](https://arxiv.org/abs/2009.07842){:target="\_blank"}<br/>
<p markdown="1" style='text-align: justify;' id="pi" style="display:none;">
Devised a family of n-state, k-action MDPs to obtain a strong lower bound of $\Omega(k^n/2)$ for policy iteration. Furthermore, we generalised the existing constructions of 2-action MDPs to k-action MDPs to scale lower bounds by a factor of $k$ for some common deterministic variants of policy iteration, and by $\log(k)$ for the corresponding randomised variants.</p>
</div>

<div markdown="1" onmouseover="document.getElementById('tapestry').style.display='block';" onmouseout="document.getElementById('tapestry').style.display='none';">
**Compressed Sensing Approach to Group-testing for COVID-19 Detection**<br/>
[Sabyasachi Ghosh](https://sghosh767.wordpress.com/){:target="\_blank"}, 
[Rishi Agarwal](https://www.cse.iitb.ac.in/~rishiagarwal/index.html){:target="\_blank"}, 
[Mohammad Ali Rehan](https://www.cse.iitb.ac.in/~alirehan/){:target="\_blank"}, 
[Shreya Pathak](https://www.cse.iitb.ac.in/~shreyapathak/){:target="\_blank"}, 
[Pratyush Agrawal](https://www.cse.iitb.ac.in/~pratyush/){:target="\_blank"}, 
[Yash Gupta](https://www.cse.iitb.ac.in/~yashgupta/){:target="\_blank"}, 
_Sarthak Consul_, 
[Nimay Gupta](https://www.cse.iitb.ac.in/~nimay/){:target="\_blank"}, 
[Ritika Goyal](https://www.cse.iitb.ac.in/~ritikagoyal/){:target="\_blank"}, 
[Prof. Manoj Gopalakrishnan](https://www.ee.iitb.ac.in/~manojg/){:target="\_blank"} and 
[Prof. Ajit Rajwade](https://www.cse.iitb.ac.in/~ajitvr/){:target="\_blank"}
<br>
IEEE Open Journal of Signal Processing 2021<br/>
[Paper](https://ieeexplore.ieee.org/document/9416868){:target="\_blank"} | [Code](https://github.com/atoms-to-intelligence/tapestry){:target="\_blank"} | [![Official Website](./web.png "Official Website") Official Website](https://tapestry-pooling.herokuapp.com/){:target="\_blank"}
<!-- &nbsp;
 [![Media Coverage](./web.png "Media Coverage") Media Coverage](https://www.nature.com/articles/d41586-020-02053-6){:target="\_blank"}  -->
<p style='text-align: justify;' id="tapestry" style="display:none;">
We propose a single-round pooled testing approach, called Tapestry, with an application to detect SARS-CoV-2 viral loads using quantitative RT-PCR that shortens testing time and conserves reagents and testing kits. A combination of combinatoric approaches (such as COMP) and compressed sensing algorithms (such as Sparse Bayesian Learning) with a novel noise model for PCR allows us to be able to recover both the status and estimated viral load of the samples. An accompanying Android application has been developed for easy implementation at testing centres.
Currently undergoing clinical trials in labs across India, with promising preliminary results.</p>
</div>

<!-- # 2019 -->
<!-- **Analysis of Lower Bounds for Simple Policy Iteration**<br/>
Sarthak Consul<sup>*</sup>, Bhishma Dedhia<sup>*</sup>, Kumar Ashutosh<sup>*</sup>, Parthasarathi Khirwadkar<sup>* </sup><br/>
preprint - [arXiv:1911.12842](https://arxiv.org/abs/1911.12842){:target="\_blank"} <sub><sup>*Equal Contributions</sup></sub> (Permanently arXived)<br/> -->

## **Research Projects**

# 2020

<div markdown="1" onmouseover="document.getElementById('btp').style.display='block';" onmouseout="document.getElementById('btp').style.display='none';">
**Style Transfer on Unpaired Music Clips**<br/>
_Bachelor's thesis guided by [Prof. Subhasis Chaudhuri](https://www.ee.iitb.ac.in/~sc/){:target="\_blank"}_
<p style='text-align: justify;' id="btp" style="display:none;">
Style transfer was introduced for images in 2015 and has been quickly commercialized in the entertainment industry. Style transfer for audio has not enjoyed the same success. We are working towards separating timbral features of the vocals from lyrical and rhythmic features from music clips and recombining appropriately for to transfer the timbral quality of the target-style vocals to the vocals of the source song. The task has been made more difficult by working within the realistic constraints of having the source song and target-style song to be unpaired.
</p>
</div>

# 2019
<div markdown="1" onmouseover="document.getElementById('spi').style.display='block';" onmouseout="document.getElementById('spi').style.display='none';">
**Analysis of Lower Bounds on Simple Policy Iteration for K-action MDPs**<br/>
_Guided by [Prof. Shivaram Kalyanakrishnan](https://www.cse.iitb.ac.in/~shivaram/){:target="\_blank"}_
<br>
<!-- preprint - [arXiv:1911.12842](https://arxiv.org/abs/1911.12842){:target="\_blank"} <sub><sup>*Equal Contributions</sup></sub> (Permanently arXived)<br/> -->
<!-- [![Read More](./pdf.png "View preprint") Read More](./SPI_lowerbound.pdf){:target="\_blank"}  -->
[![Read More](./pdf.png "arXiv:1911.12842") Project Paper](https://arxiv.org/abs/1911.12842){:target="\_blank"} 
<p style='text-align: justify;' id="spi" style="display:none;">
Simple Policy iteration (SPI) is a type of policy iteration where the strategy is to change the policy of exactly one improvable state to an arbitrary improving action at every step. Melekopoglou  and Condon [1990] showed an exponential lower bound on the number of iterations taken by SPI for a family of 2-action MDPs. We generalized the result to obtain a lower bound for the family of k-action MDPs.</p>
</div>

<div markdown="1" onmouseover="document.getElementById('segrl').style.display='block';" onmouseout="document.getElementById('segrl').style.display='none';">
**Leveraging Reinforcement Learning for Semantic and Interactive Segmentation**<br/>
_Guided by [Prof. Amit Sethi](https://www.ee.iitb.ac.in/~asethi/){:target="\_blank"}_
<p style='text-align: justify;' id="segrl" style="display:none;">
While semantic segmentation tasks are tackled by convolutional neural networks, they optimize on a differentiable approximation of the desired metric. 
Deep Reinforcement learning is explored in a bid to overcome this constraint. A per-pixel agent with an Asynchronous Actor-Critic (A3C) Network is proposed with local neighbourhood reward function which achieved an mIOU of 53.62% on the PASCAL VOC 2012 dataset. A novel hierarchical approach is also being tested for the same. This work is being extended to the interactive segmentation task.
</p>
</div>

<div markdown="1" onmouseover="document.getElementById('lac').style.display='block';" onmouseout="document.getElementById('lac').style.display='none';">
**Segmentation of Lacunar Objects from Ultra High Resolution µCT Bone Scans**<br/>
_Guided by [Prof. Ralph Müller](http://www.biomech.ethz.ch/research/ralph-mueller.html){:target="\_blank"}, Internship Project at ETH Zürich_
<p style='text-align: justify;' id="lac" style="display:none;">
Lacunae are small cavities within the bone matrix, which each contain an osteocyte. Osteocyte mechanics are governed by lacunar mechanics by phenomena such as mechanosensation,
where the shape of the lacuna is important. In an effort to understand difference in osteocyte mechanics in healthy
and patients suffering from rare forms of osteoporosis (specifically pregnancy-associated osteoporosis), the detection
and characterization of these lacunae can serve as a biomarker. The classical approach involves simply thresholding the scan
on a single value of bone mineral density. This method fails to capture many small lacunae, which is believed to be the main
area of interest in explaining the diseases of interest. We explore the use of a fully convolutional network, WNet, for segmenting lacuna in an unsupervised setting. We propose a 2 stage approach of adaptive thresholding followed by a CNN classifier to remove noise structures, to obtain good estimates of the lacunar location and shape.
</p>
</div>

# 2018

<div markdown="1" onmouseover="document.getElementById('medal').style.display='block';" onmouseout="document.getElementById('medal').style.display='none';">
**Semantic Segmentation of Medical Images using Fully Convolutional Networks**<br/>
_Guided by [Prof. Amit Sethi](https://www.ee.iitb.ac.in/~asethi/){:target="\_blank"}_
<br>
[![Read More](./web.png "Read More") Project Page](/research/medal)
<p style='text-align: justify;' id="medal" style="display:none;">
Segmentation is a per-pixel clsssification task that is more complicated than classification. We explore the use of Fully-Convolutional Neural Networks for semantic segmentation
on medical images. This has immense applications in automation and assistance in diagonosis and pathology. The work was used in establishing the baseline in the <a href="https://monuseg.grand-challenge.org" target="_blank">MoNuSeg</a> Challenge at <a href="https://www.miccai2018.org/en/" target="_blank">MICCAI 2018</a>. </p>
</div>

