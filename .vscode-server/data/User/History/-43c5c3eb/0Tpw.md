---
blogpost: true
blog_title: "ROCm Revisited: Getting Started with HIP"
date: 21 May 2025
author: 'Liam Berry, Faraaz Mustafa, Saad Rahim'
thumbnail: ''
tags: HPC, Installation, C++
category: Ecosystems and Partners
target_audience: AI/ML Developers, System Administrators
key_value_propositions: This blog serves as a refresher as to how to get started with the HIP API
language: English
myst:
    html_meta:
        "author": "Liam Berry, Faraaz Mustafa, Saad Rahim"
        "description lang=en": "This blog looks at the HIP runtime API from key concepts and installation to some code examples to showcase the functionality."
        "keywords": "HPC, HIP, ROCm, C++, Examples, Installation"
        "amd_category": "Developer Resources"
        "amd_asset_type": "Blog"
        "amd_technical_blog_type": "Ecosystem and Partners"
        "amd_blog_hardware_platforms": "Instinct GPUs"
        "amd_blog_development_tools": "ROCm Software"
        "amd_blog_applications": "AI Inference, AI Training, Computer Vision, Data Science, Design, Simulation & Modeling"
        "amd_blog_topic_categories": "HPC & Scientific Computing"
        "amd_blog_authors": "Liam Berry, Faraaz Mustafa, Saad Rahim"
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

# ROCm Revisited: Getting Started with HIP

This blog will provide an introductory guide to GPU programming using AMD’s HIP (Heterogeneous-Compute Interface for Portability) on the ROCm platform. It explains the architectural differences between CPUs and GPUs, highlighting how GPUs excel at parallel processing for tasks like machine learning and simulations. The post introduces core parallel programming concepts such as threads, blocks, grids, and memory types (local, shared, global), along with Flynn’s Taxonomy to contextualize processing models. It then walks through installing ROCm and HIP on Ubuntu 24.04 and demonstrates how to write and compile simple HIP programs, including a "Hello World" example and a matrix addition kernel.

## Introduction on GPU vs CPU architecture

### Host and Device Definition

In a heterogeneous system, the host typically refers to the CPU (central processing unit) and its associated memory, which controls the execution of a program, data management, and coordination between various devices. The device, usually a GPU (graphics processing unit), is the parallel processor that handles computation-heavy tasks and works alongside the CPU, excelling at running many operations in parallel, making it ideal for tasks involving large datasets.

The HIP programming model has two execution contexts: the main application starts on the CPU (host processor), while compute kernels are launched on the device, such as Instinct accelerators or AMD GPUs. Host execution is defined by the C++ abstract machine, whereas device execution follows the SIMT (Single Instruction, Multiple Threads) model of HIP. 

In heterogeneous programming with HIP, the CPU (host) manages the coordination between CPU and GPU (device) by handling data transfers, kernel launches, and task synchronization. The process begins with initializing the HIP runtime and selecting a target GPU, followed by preparing and transferring data from host to device memory. The host then configures and launches GPU kernels. Finally, the host retrieves results, validates output, and cleans up resources. This structured workflow enables efficient use of GPU acceleration while keeping the CPU free for managing overall application logic.

```{figure} ./images/host-device-flow.svg
:align: center
:alt: Host Device Flow
Figure 1: Interaction Flow between the Host and Device in a GPU Program
```

### GPU and CPU Architecture

Here are some key architectural differences between the CPU and the GPU

| Feature                                      | CPU                                                       | GPU                                                       |
|----------------------------------------------|-----------------------------------------------------------|-----------------------------------------------------------|
| **Processing Type**                          | Optimized for sequential processing with few high-performance cores (4-64). | Built for parallel processing with many simpler cores (hundreds to thousands). |
| **Clock Speed**                              | Operates at high clock speeds (3-5 GHz).                  | Operates at lower clock speeds (1-2 GHz).                 |
| **Thread Register Files**                    | Each thread has its own register file; hyperthreading allows up to 2 register files per core. | Register files are shared among threads; the number of threads that can run in parallel depends on the registers required per thread. |
| **ALU (Arithmetic Logic Unit)**              | A single ALU executes each thread.                        | Multiple ALUs process a group of threads performing the same operation (wavefront/warp). |
| **Instruction Execution**                    | Designed to quickly execute instructions within a single thread. | Uses Single Instruction, Multiple Threads (SIMT) execution. |
| **Branch Prediction**                        | Utilizes sophisticated branch prediction for handling conditional operations. | For thread divergence, ALUs process the entire wavefront, masking results for divergent threads. |
| **Cache**                                    | Large L1/L2 caches per core, shared among fewer threads (typically 2 with hyperthreading). | Equipped with small caches and a larger number of registers compared to CPUs. |
| **Context Switching**                        | Context switching is time-intensive (ALU pipeline must be flushed, register files written to memory). | Context switching is efficient, as threads' registers are stored on the compute unit, avoiding the need to move them to global memory.|

```{figure} ./images/CPUvsGPU.drawio.png
:align: center
:alt: Architectural Differences between a CPU and a GPU
Figure 2: Architectural Differences between a CPU and a GPU
```

### Use Case for the CPU vs GPU

The CPU is ideal for tasks requiring sequential processing, complex branching, and fast decision-making. It is optimized for low-latency operations with fewer cores but higher individual core performance. Examples include handling I/O operations, logic-heavy algorithms, and managing tasks that require decision-making.

The GPU shines in scenarios requiring massive parallelism and throughput optimization. GPUs are designed for performing repetitive computations across large datasets simultaneously, making them perfect for tasks like image processing, machine learning, and scientific simulations.

## Introduction to Parallelism

Parallelism in computing involves breaking down a task into smaller sub-tasks that can be executed simultaneously, utilizing multiple processing units. Parallelism can be achieved either by multi-core (multi-threaded) CPUs or more importantly by massive parallelism in GPUs.

### Flynn's Taxonomy

Flynn’s Taxonomy classifies computer architectures based on the number of instruction streams and data streams they can handle simultaneously. The four classifications are:

**1. SISD (Single Instruction Single Data):** Traditional single-core CPU, where one instruction operates on a single data element.

**2. SIMD (Single Instruction Multiple Data):** This is the architecture of GPUs, where a single instruction operates on multiple data elements in parallel (e.g., adding vectors).

**3. MISD (Multiple Instruction Single Data):** Rare in practice, where multiple instructions operate on the same data element.

**4. MIMD (Multiple Instruction Multiple Data):** Typical of multi-core CPUs, where different cores execute different instructions on different data simultaneously.

```{figure} ./images/simt-execution.svg
:align: center
:alt: SIMT instruction flow
Figure 3: Instruction flow of a sample SIMT program
```

### Threads, Wavefronts, Blocks, Grids

In GPU programming, parallel computation is divided into a hierarchy:

**Thread:** The smallest unit of execution. Each thread runs an instance of the kernel (GPU function) and performs calculations on a subset of data.

**Block:** A group of threads, often organizere threads can cooperate by sharing data in shared memory. Each block operates independently of others.

**Grid:** A collection of blocks that together execute a kernel on the GPU. The entire grid may consist of thousands of blocks, and it’s the highest-level unit of work in GPU programming.

**Wavefront:** A group of threads that are processed simultaneously within a single SIMD unit in a GPU.

```{figure} ./images/ThreadsBlockGrid.drawio.png
:align: center
:alt: Depiction of Threads, Blocks and Grids
Figure 4: Visual Depiction of Threads, Blocks and Grids.
```

### Memory (Local, Shared, Global)

Understanding memory types is key to optimizing GPU performance:d into a 1D, 2D, or 3D structure, whe

**Local Memory:** Private memory used by each thread. It is very fast but limited in size and typically used for temporary data storage during computations.

**Shared Memory:** Shared memory is accessible by all threads within a block. It’s faster than global memory but limited in size. It is used for storing data that needs to be accessed frequently by threads within a block.

**Global Memory:** Global memory is the main memory of the device and is accessible by all threads across all blocks. It has high latency compared to shared and local memory but provides much larger storage capacity.

## What is HIP

HIP (Heterogeneous-Compute Interface for Portability) is an API designed by AMD to allow C/C++ programs to run on different GPU architectures, enabling portability across devices. It abstracts the underlying hardware differences between CPUs and GPUs, making it easier to write programs that can be executed on different platforms, such as AMD and NVIDIA GPUs. HIP provides an interface for managing memory, launching kernels, and synchronizing between the host (CPU) and the device (GPU). It supports data-parallel execution, where the same operation is applied across many data elements in parallel, making it ideal for GPU-accelerated computations.

## Installing HIP

To start programming with HIP you will first need to install it. For the full installation documentation you can look [here](https://rocm.docs.amd.com/projects/HIP/en/latest/install/install.html). In this blog we will cover the  quick start installation of ROCm using Ubuntu 24.04.

You can install ROCm using the following terminal commands:

```bash
wget https://repo.radeon.com/amdgpu-install/6.4.1/ubuntu/noble/amdgpu-install_6.4.60401-1_all.deb
sudo apt install ./amdgpu-install_6.4.60401-1_all.deb
sudo apt update
sudo apt install python3-setuptools python3-wheel
sudo usermod -a -G render,video $LOGNAME # Add the current user to the render and video groups
sudo apt install rocm
```

To apply all settings, reboot your system. You can then check that HIP has installed successfully with the following terminal command:

```bash
/opt/rocm/bin/hipconfig --full
```

Now that HIP is successfully installed we can start programming!

## Write Your First Program Using HIP

After you have verified that the installation was successful, you can start your first HIP program. Let's cover some of the basic API calls and syntax.

First we need to include the HIP runtime header file:

```cpp
#include <hip/hip_runtime.h>
```

After this we need to create our kernel. The basic kernel syntax is a function that returns void prefaced by the keyword `__global__` so that the kernel can be called by the host:

```cpp
__global__ void kernel(args) {}
```

Now we need to know how to get the global thread ID in our grid. As explained earlier, the grid is made up of blocks each containing a specific number of threads. This means that any thread ID will be the grid size multiplied by the block ID plus the local thread ID:

```cpp
int gid = blockIdx.x * blockDim.x + threadIdx.x;
```

When performing work on a thread, it is also important to make sure that threads don't repeat the same work and that the size of the problem is not exceeded by the threads. We can ensure this with a conditional check where N is the size of the problem:

```cpp
if (gid < N)
{
    //Perform work on thread
}
```

```{note}
This example is fitted for a one dimensional problem, for 2D or 3D problems thread IDs and conditional checks will have to account for all dimensions.
```

Now that the kernel is set up we need to launch it from the host in main. We can do so with the following line:

```cpp

kernel<<<dim3(gridSize), dim3(blockSize)>>>(args);

```
The syntax starts with the kernel name followed by a tripple chevron. This contains the initialization parameters for the kernel in terms of how many blocks it will run (i.e. the grid size) and how many threads per block (i.e. the block size). Finally the input arguments are given.

Now that we know the basic syntax let's go over a couple examples.

For the first example let's print hello world from the GPU:

```cpp
#include <hip/hip_runtime.h>

__global__ void gpuHelloWorld(int N) 
{
    int gid = blockIdx.x * blockDim.x + threadIdx.x;
    if (gid < N) 
    {
        printf("Hello world from block %d and thread %d \n", blockIdx.x, gid); 
    }
}

int main() 
{
    int gridSize = 4; //Four blocks
    int blockSize = 4; //Threads per block
    int N = gridSize * blockSize; //Size of problem

    gpuHelloWorld<<<gridSize, blockSize>>>(N); //Launch kernel

    return 0;
}
```

You can then compile the code in the terminal with the line:

```bash
hipcc <file name> -o <build file name>
```

You should get an output similar to the following:

```bash
Hello world from block 3 and thread 12 
Hello world from block 3 and thread 13 
Hello world from block 3 and thread 14 
Hello world from block 3 and thread 15 
Hello world from block 0 and thread 0 
Hello world from block 0 and thread 1 
Hello world from block 0 and thread 2 
Hello world from block 0 and thread 3 
Hello world from block 2 and thread 8 
Hello world from block 2 and thread 9 
Hello world from block 2 and thread 10 
Hello world from block 2 and thread 11 
Hello world from block 1 and thread 4 
Hello world from block 1 and thread 5 
Hello world from block 1 and thread 6 
Hello world from block 1 and thread 7 
```

```{note}
Your terminal output may not be the same as the one shown above. Since each block is run in parallel one may finish before the other, this means the order is not guaranteed.
```

Let's look at one more example that's a bit more involved and perform a simple matrix addition on the GPU.

```cpp
#include <hip/hip_runtime.h>
#include <iostream>
#include <vector>

// Matrix addition kernel
__global__ void matrixAddition(float* A, const float* B, const int Nx, const int Ny)
{
    const int x = blockIdx.x * blockDim.x + threadIdx.x;
    const int y = blockIdx.y * blockDim.y + threadIdx.y;

    if (x < Nx && y < Ny) 
    {
        //In HIP the indicies are column major
        const int idx = y * Nx + x;
        A[idx] += B[idx];
    }
}

// Helper functions for filling matrices
void fillMatrix(std::vector<float>& mat, const int m, const int n)
{
    assert(mat.size() == n * m);
    for(int i = 0; i < n; ++i)
    {
        for(int j = 0; j < m; ++j)
        {
            const int idx = i * m + j;
            mat[idx]      = i + j;
        }
    }
}

// Computes ceil(numerator/divisor) for integer types. 
// This helps us determine how many threads to use based on the problem size and the grid size
template <typename intT1,
          class = typename std::enable_if<std::is_integral<intT1>::value>::type,
          typename intT2,
          class = typename std::enable_if<std::is_integral<intT2>::value>::type>
intT1 ceildiv(const intT1 numerator, const intT2 divisor)
{
    return (numerator + divisor - 1) / divisor;
}

int main() 
{
    const int Nx = 5; //rows
    const int Ny = 4; //columns

    // Host input data
    std::vector<float> matrixA(Nx * Ny);
    fillMatrix(matrixA, Nx, Ny);
    std::vector<float> matrixB(Nx * Ny);
    fillMatrix(matrixB, Nx, Ny);

    // Host output data
    std::vector<float> finalMatrix(matrixA.size());

    //Memory to allocate to device data in bytes
    const size_t matrixMem = matrixA.size() * sizeof(decltype(matrixA)::value_type);

    //Device data to be sent to the kernel 
    float* dA = nullptr;
    float* dB = nullptr;

    //Allocate device memory on GPU
    assert(hipMalloc(&dA, matrixMem) == hipSuccess);
    assert(hipMalloc(&dB, matrixMem) == hipSuccess);

    //Copy data from the host to the device
    assert(hipMemcpy(dA, matrixA.data(), matrixMem, hipMemcpyHostToDevice) == hipSuccess);
    assert(hipMemcpy(dB, matrixB.data(), matrixMem, hipMemcpyHostToDevice) == hipSuccess);

    //Launch the kernel
    matrixAddition<<<dim3(32, 32), dim3(ceildiv(Ny, 32), ceildiv(Nx, 32))>>>(dA, dB, Nx, Ny);

    //Copy the output data from the device back to the output host data
    assert(hipMemcpy(finalMatrix.data(), dA, matrixMem, hipMemcpyDeviceToHost) == hipSuccess);

    //Free allocated GPU memory
    assert(hipFree(dA) == hipSuccess);
    assert(hipFree(dB) == hipSuccess);

    //Check error of computation
    float maxerr = 0.0;
    for(int i = 0; i < finalMatrix.size(); ++i) {
        float diff = std::abs(matrixA[i] + matrixB[i] - finalMatrix[i]);
        if(diff > maxerr)
            maxerr = diff;
    }
    std::cout << "max error: " << maxerr << "\n";

}

```
The output should be an error of zero showing that the GPU successfully added the two matrices.

Now that you've seen the basics as well as a couple examples you're ready to start making your own programs using the full power of your computer!

If you're interested in looking at what else HIP has to offer you can look at the full HIP documentation [here](https://rocm.docs.amd.com/projects/HIP/en/latest/index.html).
Additionally, you can find more practice examples showcasing the basics of HIP [here](https://github.com/ROCm/rocm-examples/tree/develop/HIP-Basic/).

<!--
Add additional resources here too and maybe shorten the second example as it's a little long
-->
## Summary

ROCm Blogs follow a consistent magazine-article approach where each blog ends with a “Summary” section.
Please provide a brief summary of your blog, reiterating the main takeaways and deliverables, as well
as what the reader learned from it.

## Disclaimers

Third-party content is licensed to you directly by the third party that owns the
content and is not licensed to you by AMD. ALL LINKED THIRD-PARTY CONTENT IS
PROVIDED “AS IS” WITHOUT A WARRANTY OF ANY KIND. USE OF SUCH THIRD-PARTY CONTENT
IS DONE AT YOUR SOLE DISCRETION AND UNDER NO CIRCUMSTANCES WILL AMD BE LIABLE TO
YOU FOR ANY THIRD-PARTY CONTENT. YOU ASSUME ALL RISK AND ARE SOLELY RESPONSIBLE
FOR ANY DAMAGES THAT MAY ARISE FROM YOUR USE OF THIRD-PARTY CONTENT.
