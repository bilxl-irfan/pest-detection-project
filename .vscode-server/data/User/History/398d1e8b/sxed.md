---
blogpost: true
blog_title: "AMD ROCm: Powering the Worlds Fastest Supercomputers"
date: 26 May 2025
author: 'Mohammed Faraaz Mustafa, Saad Rahim'
thumbnail: 'supercomputing.png'
tags: AI/ML, Scientific Computing, HPC, Performance
category: Ecosystems and Partners
target_audience: AI/ML Developers, System Administrators
key_value_propositions: This blog serves as an educational piece on AMD success in the supercomputing space
language: English
myst:
    html_meta:
        "author": "Mohammed Faraaz Mustafa"
        "description lang=en": "Discover how ROCm drives the world’s top supercomputers, from El Capitan to Frontier, and why its shaping the future of scalable, open and sustainable HPC"
        "keywords": "rocm, supercomputing, Frontier, top500, exascale, HPC"
        "amd_category": "Developer Resources"
        "amd_asset_type": "Blog"
        "amd_technical_blog_type": "Ecosystem and Partners"
        "amd_blog_hardware_platforms": "Instinct GPUs"
        "amd_blog_development_tools": "ROCm Software"
        "amd_blog_applications": "Generative AI, AI Inference, AI Training, Data Science, Design, Simulation & Modeling"
        "amd_blog_topic_categories": "Software & Ecosystem"
        "amd_blog_authors": "Mohammed Faraaz Mustafa"
---

<!---
Copyright (c) 2025 Advanced Micro Devices, Inc. (AMD)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
--->

# AMD ROCm: Powering the World's Fastest Supercomputers

# AMD ROCm: The Only Open-Source Platform Powering Exascale Supercomputing

From breaking the exaFLOP barrier with Frontier to to setting new performance records with El Capitan, AMD is transforming what’s possible in high-performance computing (HPC). But the story goes beyond hardware. At the core of these world-class systems is ROCm, AMD’s open, high-performance software platform enabling new levels of scientific discovery and AI advancement.

This article explores how AMD’s ROCm is helping power the world’s most advanced supercomputers—and why it’s shaping the future of scalable, sustainable supercomputing.

## Breaking the Exascale Barrier

AMD-powered Frontier at Oak Ridge National Laboratory made history as the first supercomputer to break the exascale barrier. The exascale barrier represents the threshold where a computing system achieves at least one quintillion (10^{18}) floating-point operations per second. Crossing this barrier allows researchers to run simulations and AI workloads at a scale previously unattainable.

### El Capitan: The Pinnacle of Performance

El Capitan, located at Lawrence Livermore National Laboratory, stands as the world's fastest supercomputer. Launched and operational on November 18th, 2024, it achieved a staggering 1.742 exaflops on the High Performance Linpack (HPL) benchmark, surpassing its predecessors in both speed and efficiency [1]. This monumental performance is powered by AMD's Instinct MI300A Accelerated Processing Units (APUs), which integrate custom AMD 4th-Gen EPYC 24-core CPUs and GPUs, supported by the ROCm 6.0.

Engineered primarily for national security simulations at LLNL, El Capitan is expected to revolutionize stockpile stewardship with AI-accelerated modeling.

El Capitan has secured the #1 spot for both HPL-MxP and HPCG benchmarks at ISC (add link), showcasing its versatility beyond raw speed. With 16.679 exaFLOPS on HPL-MxP (run on 10,952 nodes), El Capitan excels at AI and machine learning workloads that leverage lower-precision calculations for faster, more efficient processing. At the same time, its 17.4 petaflops performance on HPCG (run on 10,880 nodes) demonstrates exceptional capability in high-precision computations critical for traditional scientific simulations and engineering applications. These top rankings underscore El Capitan’s balanced architecture, optimized to deliver peak performance across diverse workloads—from AI-driven innovation to high-performance computing.
//Add explanation on the ..

```{figure} ./images/El-Capitan.jpg
:align: center
:alt: El-Capitan Visual Depiction
Figure 1: El-Capitan Situated in Lawrence Livermore National Laboratory.
```

### Frontier: A Trailblazer in Exascale Computing

Frontier, located at Oak Ridge National Laboratory, was the first supercomputer to officially break the exascale threshold, achieving a performance of 1.353 exaflops on May 27th, 2022 [1]. This groundbreaking system ranks as the world’s second most powerful supercomputer.

Powered by AMD’s 3rd-generation EPYC CPUs and Instinct MI250X GPUs, Frontier comprises 9,408 CPUs and 37,632 GPUs — totaling over 50 million cores. Each compute node links one CPU to four GPUs, enabling highly optimized parallel processing. Running on the ROCm platform, Frontier delivers exceptional performance while prioritizing energy efficiency.

Frontier not only leads in raw computing power but also debuted at the top of the Green500 list as the world’s most energy-efficient supercomputer [2]. It’s designed to drive groundbreaking research in fusion energy, climate science, and artificial intelligence.

```{figure} ./images/Frontier.jpg
:align: center
:alt: Frontier Visual Depiction
Figure 2: The Frontier supercomputer hosted at the Oak Ridge Leadership Computing Facility (OLCF).
```

## Why Open Source Software is the Key to Sustainable Innovation

//Proprietary software ecosystems limit collaboration and create vendor l. ROCm offers a fundamentally different model: one based on openness, portability, and transparency.
Key benefits of ROCm’s open-source approach:

* Freedom to inspect, extend, and optimize the full stack—from compiler to kernel
* Portability of code between AMD, Nvidia, and future architectures via HIP
* Faster innovation from a growing developer community contributing upstream
* Compatibility with major open-source frameworks like PyTorch, TensorFlow, and Kokkos

An example of this open ecosystem in action is the collaboration around the [LUMI supercomputer and the AI2 OLMo project](https://www.lumi-supercomputer.eu/ai2-olmo-an-open-language-model-made-by-scientists-for-scientists/). The Allen Institute for AI recently announced AI2 OLMo (Open Language Model), a fully open, state-of-the-art generative language model developed specifically for scientific research. Using LUMI, one of the world’s fastest and greenest pre-exascale AMD supercomputers, OLMo aims to democratize access to large language models by openly sharing all aspects of model creation—from data and training code to evaluation benchmarks and ethical considerations.

This openness has ripple effects beyond supercomputers. Developers at national labs, universities, and startups can use the same ROCm stack powering the world’s fastest supercomputers and ensure long-term sustainability of scientific software.

//Link to Liam Blog...

## Global Impact of AMD-Powered Supercomputers

AMD's influence extends beyond the United States, with several international supercomputers leveraging its technology:

* LUMI: Situated in Finland, LUMI is Europe's fastest supercomputer, boasting a peak performance of over 550 petaflops. It employs AMD EPYC CPUs and Instinct MI250X GPUs, all managed via the ROCm ecosystem.
* HPC6: Located in Bologna, Italy, HPC6 delivers 477.9 petaflops of performance, ranking it among the top supercomputers globally. It relies on AMD's hardware and ROCm software for its operations.
* Tuolumne: As a precursor to El Capitan, Tuolumne achieved 208.1 petaflops, showcasing the capabilities of AMD's MI300A APUs and ROCm integration.

//PWSEY supercomputing center

## AMD in the TOP500 and Green500 Lists

AMD's commitment to performance and efficiency is evident in its presence on the TOP500 and Green500 lists:

* AMD's Frontier debuted top of the Green500 list for most efficient supercomputers [2].
* As of November 2024, AMD powers 156 supercomputers on the TOP500 list, marking a 29% increase from the previous year [3].
* On the Green500 list, which ranks supercomputers based on energy efficiency, AMD holds 157 entries, underscoring its dedication to sustainable computing [3].

```{figure} ./images/Performance(Exaflops).png
:align: center
:alt: AMD's Supercomputers Performance
Figure 5: AMD leads the top supercomputers with impressive performance.
```

## Frontier’s Scientific Wins Powered by ROCm

Frontier is not just a benchmark machine—it’s already delivering breakthroughs in science and engineering. ROCm plays a pivotal role in accelerating these discoveries by enabling optimized compute kernels, mixed-precision AI workflows, and seamless scaling across GPUs.
Some real-world highlights:

* Simulating Microscopic Behavior: Modeling the behavior of up to 600,000 electrons in a magnesium alloy with the accuracy of a quantum Monte Carlo simulation [4].
* Modeling the Universe: Using dark matter and the movement of gas and plasma—not just gravity—to simulate the observable universe on Frontier [5].
* Jet Engine Design: Predicting airflow and noise from a fuel-efficient jet engine to optimize its design [6].
* Nuclear Reactor Optimizations: Simulating heat transfer through the core of a modular nuclear reactor to advance clean energy solutions [7].
* Advancing Nuclear Fission Research: Speeding up the nuclear fission process by improving laser-based electron accelerator designs—work honored with the 2022 ACM Gordon Bell Prize [7].
  
AMD's Dr. Jakub Kurzak, has been instrumental in advancing the frontiers of computational chemistry and high-performance computing (HPC). His recent work, recognized with the prestigious [2024 ACM Gordon Bell Prize](https://www.acm.org/media-center/2024/november/gordon-bell-prize-2024#:~:text=Atlanta%2C%20GA%2C%20November%2021%2C%202024%20%E2%80%93%20ACM%2C%20the,Biomolecular-Scale%20Ab%20Initio%20Molecular%20Dynamics%20Using%20MP2%20Potentials.%E2%80%9D), showcases the profound impact of AMD supercomputers on research on both scientific discovery and industry innovation. Jakub was a core member of an eight-person international team that developed an algorithm capable of simulating over one million electrons on exascale supercomputers like Frontier. This accomplishment set a new standard for accuracy and efficiency in molecular dynamics.

By accelerating everything from numerical solvers to AI inference pipelines, ROCm empowers researchers to do more science, faster.

## How ROCm Enables Exascale-Level Coordination Across GPUs

At exascale, performance is no longer just about speed—it's about efficient coordination across tens of thousands of GPUs. This is where ROCm excels.
ROCm enables tight orchestration across Frontier’s 37,888 AMD Instinct™ GPUs.

* Each compute blades are linked together by HPE Slingshot interconnects, each with a custom-designed 64-port switch that provides 12.8 terabits per second of network bandwidth. Groups of blades are linked together via dragonfly topology in which hundreds of cabinets with hundreds of thousands of nodes can all communicate with just three hops at most between all nodes.
* RCCL (ROCm Collective Communication Library): optimized for all-reduce and broadcast operations across GPUs
* ROCm-aware MPI: integration with MPI stacks such as OpenMPI and MPICH for large-scale distributed workloads
  
Together, these technologies allow thousands of GPUs to work unified from a single node to full system size without sacrificing performance.

## AMD ROCm and the Future of Scalable, Sustainable Supercomputing

From Frontier’s groundbreaking leap into the exascale era to El Capitan’s ascent as the world’s fastest supercomputer, AMD has reshaped the high-performance computing landscape. At the heart of these achievements lies ROCm—an open software platform that’s enabling the next generation of scientific discovery and national-scale simulation.

ROCm doesn’t just support AMD hardware—it unlocks its full potential. With deep support for multi-GPU scalability, modern AI frameworks, and code portability through HIP, ROCm empowers developers and researchers around the world to tackle problems once thought impossible—from fusion energy and molecular dynamics to climate modeling and cryptographic security.

AMD maintains a strong commitment to supporting double-precision floating-point (FP64) capabilities, recognizing that true high-performance computing (HPC) capacity requires robust precision to be viable for critical applications. According to Dr. Bradley McCredie, Senior Vice President of AMD’s Data Center GPU and Accelerated Processing Business Unit, delivering effective HPC solutions means designing hardware with full double-precision support and data pathways specifically tailored to the HPC ecosystem [8]. Unlike some vendors who have reduced their focus on FP64—effectively encouraging the HPC community to adapt to lower-precision alternatives—AMD prioritizes building products that meet the exacting precision and performance needs of HPC workloads. This approach is reflected in AMD’s roadmap, which continues to emphasize comprehensive double-precision math capabilities, ensuring sustained support for demanding scientific and engineering applications.

Importantly, ROCm's open-source foundation ensures that this power isn't locked away—it’s shared. The same stack that runs the world’s most powerful systems is available to academia, startups, and the global HPC community, driving innovation from the lab to the cloud.

## Summary

This blog explores how AMD’s ROCm open-source software platform powers the world’s fastest supercomputers, including El Capitan and Frontier, enabling breakthrough performance and scalability in high-performance computing and AI workloads. It highlights the cutting-edge hardware innovations behind these systems, the critical role ROCm plays in orchestrating multi-GPU coordination, and showcases real-world scientific achievements made possible by AMD technology. Additionally, the blog discusses the global impact of AMD-powered supercomputers, the importance of open-source software for sustainable innovation, and AMD’s commitment to precision and efficiency in shaping the future of scalable supercomputing.

## Citations

[1] “El Capitan achieves top spot, Frontier and Aurora follow behind | TOP500,” Top500.org, 2024. https://www.top500.org/news/el-capitan-achieves-top-spot-frontier-and-aurora-follow-behind/
\
[2] “Computer engineers at ORNL pioneer approaches to energy efficient supercomputing | ORNL,” ORNL, Sep. 10, 2024. https://www.ornl.gov/news/computer-engineers-ornl-pioneer-approaches-energy-efficient-supercomputing
\
[3] “AMD’s New Instinct MI300A APU Powers Three Supercomputers in the Latest Top500 Rankings,” Sahm, 2024. https://www.sahmcapital.com/news/content/amds-new-instinct-mi300a-apu-powers-three-supercomputers-in-the-latest-top500-rankings-2024-05-13 (accessed May 27, 2025).
\
[4] “Exascale Supercomputers With 10^18 FLOPS To Revolutionise Material Simulations. Driving The Development Of Fuel-Efficient Cars And Novel Superconductors,” Quantum Zeitgeist, Nov. 25, 2023. https://quantumzeitgeist.com/exascale-supercomputers-revolutionise-material-simulations-paving-way-for-fuel-efficient-cars-and-novel-superconductors/ (accessed May 27, 2025).
\
[5] D. Turney, “Supercomputer runs largest and most complicated simulation of the universe ever,” livescience.com, Feb. 13, 2025. https://www.livescience.com/technology/computing/supercomputer-runs-largest-and-most-complicated-simulation-of-the-universe-ever
\
[6] staff, “GE Aerospace Runs New Engine Architecture Simulations on Frontier Exascale Supercomputer - High-Performance Computing News Analysis | insideHPC,” High-Performance Computing News Analysis | insideHPC, Jun. 19, 2023. https://insidehpc.com/2023/06/ge-aerospace-runs-one-of-the-worlds-largest-supercomputer-simulations-to-test-revolutionary-new-open-fan-engine-architecture/ (accessed May 27, 2025).
\
[7] “Early Frontier users seize exascale advantage, grapple with grand scientific challenges | ORNL,” www.ornl.gov. https://www.ornl.gov/news/early-frontier-users-seize-exascale-advantage-grapple-grand-scientific-challenges
\
[8] T. P. Morgan, “Brad McCredie Is The Pedal To AMD’s Datacenter GPU Metal,” The Next Platform, Jan. 24, 2025. https://www.nextplatform.com/2025/01/24/brad-mccredie-is-the-pedal-to-amds-datacenter-gpu-metal/ (accessed Jun. 04, 2025).

## Disclaimers

Third-party content is licensed to you directly by the third party that owns the
content and is not licensed to you by AMD. ALL LINKED THIRD-PARTY CONTENT IS
PROVIDED “AS IS” WITHOUT A WARRANTY OF ANY KIND. USE OF SUCH THIRD-PARTY CONTENT
IS DONE AT YOUR SOLE DISCRETION AND UNDER NO CIRCUMSTANCES WILL AMD BE LIABLE TO
YOU FOR ANY THIRD-PARTY CONTENT. YOU ASSUME ALL RISK AND ARE SOLELY RESPONSIBLE
FOR ANY DAMAGES THAT MAY ARISE FROM YOUR USE OF THIRD-PARTY CONTENT.
