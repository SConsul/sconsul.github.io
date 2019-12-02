---
layout: page
---

<h3><b> Pipelined and Multicycle Implementation of IITB-RISC ISA </b></h3>

Course Project for EE309 - Microprocessors, Autumn 2018

with P. Khirwadkar, B. Dedhia and K. Porlikar

[[Code]](https://github.com/SConsul/RISC-Microprocessor-Design){:target="\_blank"}

<img src="./pipeline.png">


IITB-RISC is a small architecture for doing basic 16 bit operations. The goal of the project was to design a microprocessor for the ISA using the following implementations:

- Multicycle
- Pipelined 

Our implementation was done on VHDL in the following manner:

- Multicycle: The control and data paths were bifurcated. The control path was a 22 stage Finite State machine. This design was synthesized on a Altera Nano FPGA.
- Pipelined: We implemented a 6 stage pipeline design. The design also included priority encoders and hazard detection units to reduce latencies annd eliminate branch hazards.

