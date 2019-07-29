---
layout: projectpage
title: DPAC
cardtitle: Digitally Programmable Analog Computer
fulltitle: Digitally Programmable Analog Computer
description: ELECTRONICS DESIGN LAB
fulldescription: Course Project for EE344 - Electronics Design Laboratory, Spring 2019
team: with P. Khirwadkar and P. Joshi
year: 2019
img: /assets/img/DPAC_board.png
---

[[Technical Report]]({{ '/assets/pdf/dpac.pdf' | prepend: site.baseurl | prepend: site.url }}){:target="\_blank"} [[Code]](https://github.com/SConsul/Digitally-Programmable-Analog-Computer){:target="\_blank"}

<div class="img_blog">
    <img class="col three left" src="{{ site.baseurl }}/assets/img/DPAC_board_inverted.png" alt="" title="DPAC Schematic"/>
</div>
<div class="col three caption">
    Schematic of Final Prototype
</div>


Hardware-in-the-loop simulations are very commonly used to test controller design and monitor how the controller responds, in real time, to realistic virtual stimuli. In an HIL simulation, a real-time computer is used as a virtual representation of the plant model and a real version of the concerned controller. Most of these dynamical systems are in the form of coupled differential equations, and digital computers tend to be terribly slow at iteratively approximating solutions to such systems. 
Hybrid computers try to combine the high speed of the analog comuters with the versatility and precision of digital computers to effectively solve such problems.

DPAC v2.0 is a hybrid computer, capable of solving upto an 8th order system of non-linear differential equations. In DPAC v2.0, we have included a processor in the loop, to perform all the non-linear computations. The integration step has been done in the analog domain.The DPAC is capable of solving non linear dynamical systems upto 8 variables of the form:
{% raw %}
$$\frac{\partial x_k(t)}{\partial t} = f_k\big(x_1,x_2,..,x_8, u_1(t),..,u_4(t)\big) \text{ for } k \in \{1,2,...8 \} $$
{% endraw %}

Where the functions $$f_k$$ are a wide class of linear/non-linear functions (such as products or trigonometric functions of the state variables $$x_{k}$$ and forcing functions $$u_i(t)$$ for $$i=1,2,3,4$$).
The final prototype is completely self-sufficient with an onboard power management circuit and digitally programmable through the onboard microcontroller. The programmability of switches enable the DPAC to change its configuration on the go and hence it can support a large range of frequencies. 


<div class="img_blog">
    <img class="col three left" src="{{ site.baseurl }}/assets/img/DPAC_BlockDiagram.png" alt="" title="DPAC Oveerview"/>
</div>
<div class="col three caption">
    Overview of the system
</div>

This project was supported by the Prof. Mukul Chandorkar, dept. of Electrical Engg. IIT Bombay for hardware-in-loop simulations in the power electronics lab.

