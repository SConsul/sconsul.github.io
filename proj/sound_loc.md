---
layout: page
---

<h3><b> Analog Sound Locator </b></h3>

Course Project for EE230 Analog Lab, Spring 2018

with T. Dhawal

<img src="./soundlocator_demo.gif">


Taking inspiration from mammalian bi-aural hearing, we built a prototype analog circuit that uses phase difference to locate sound sources. The slightly separated microphones recieve sound signals that are slightly differ in phase. The goal of the circuit is to measure the phase differnce, which then be directly correlated to the spatial angle. 

![](./SpatialAngle.jpg)
<p align="center"><em>Phase Difference obtained by spaced microphones</em></p>

To measure phase difference finding the amplitude of the signals, the 2 signals had their phases dynamicaly locked by passing them through voltage controlled delay circuits. The voltage-controlled delay circuits are essentially all pass filers with a variable resistance (realised used a JFET with varying gate potential). 
Extensive simulation was done on NgSpice to test the circuit design and components (esp. JFETs) were tested both in simulation and in hardware to obtain the variation of source-drain resistance with gate voltage and appropriately desing the remainder of the circuit. 

The final prototype was compact and converged quickly (within a second). It was one of the winning projects in the final course evaluation. 

