---
layout: projectpage
title: Reaction Game
cardtitle: Reaction Game
fulltitle: Reaction Game
description: Digital Circuits
fulldescription: Course Project for EE214 Digital Lab, Spring 2018
<!--team: P. Khirwadkar, A. Prasad and D. Gopalan-->
year: 2018
img: /assets/img/reactiongame.jpg
---

<div class="img_blog">
    <img class="col three left" src="{{ site.baseurl }}/assets/img/reactiongame.gif" alt="" title="Demonstration">
</div>
<div class="col three caption">
   Reaction Game in action
</div>

The goal of this project was to build a reaction game on the Krypton CPLD Board. Reaction games are part standard testing paradimgs employed by neurologists, psychlogists and physiotherapists to test human visual reaction. To do this, a finite state machine was implemented in VHDL. RTL abstraction was used to realise the control flow. 
While making this reaction game, the following points should be taken into consideration:

Need to ensure proper time intervals between trainsition to next state of FSM
- A timeout should be called if no reaction is observed to an LED lighting within a window of 2.5s after stimuli
- Failsafe against button mashing by having a check against multiple reacts and reacts in the absence of LED stimuli
- Debouncing the button: As multiple presses result in failing, the mechanical swithces have to be debounced 
This is done by only considering signal levels that are maintained for 2 consecutive clock periods of around 100Hz
- The delays between LED lighting up should be random. This has been approximated by generating a pseudo-random number by sampling a fast sequence


The game works by finding the average reaction time to an LED lighting up in 8 trials and printing the said time on the LCD.- 


