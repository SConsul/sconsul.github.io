---
layout: projectpage
title: Projects
permalink: /projects/
description: A collection of projects I have worked on as a part of my undergraduate curriculum and some out of self-interest.
---

{% for project in site.projects %}

{% if project.redirect %}
<div class="project">
    <div class="thumbnail">
        <a href="{{ project.redirect }}" target="_blank">
        {% if project.img %}
        <img class="thumbnail" src="{{ project.img | prepend: site.baseurl | prepend: site.url }}"/>
        {% else %}
        <div class="thumbnail blankbox"></div>
        {% endif %}    
        <span>
            <h1>{{ project.title }}</h1>
            <br/>
            <p>{{ project.description }}</p>
	    <br/>
            <p>{{ project.year }}</p>
        </span>
        </a>
    </div>
</div>
{% else %}

<div class="project ">
    <div class="thumbnail">
        <a href="{{ project.url | prepend: site.baseurl | prepend: site.url }}" title="Click for details">
        {% if project.img %}
        <img class="thumbnail" src="{{ project.img | prepend: site.baseurl | prepend: site.url }}"/>
        {% else %}
        <div class="thumbnail blankbox"></div>
        {% endif %}    
        <span>
            <p>{{ project.year }} </p>
            <p><font color="#1472D0">{{ project.description }}</font></p>	
            <h1>{{ project.cardtitle }}</h1>
        </span>
        </a>
    </div>
</div>

{% endif %}

{% endfor %}
