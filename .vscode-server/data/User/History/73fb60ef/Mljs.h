#ifndef HIP_TO_CUDA_H
#define HIP_TO_CUDA_H

/* ────────────────────────────────────────────────────────────────
   If we are building with HIP-Clang (`hipcc`) on AMD hardware
   ──────────────────────────────────────────────────────────────── */
#if defined(__HIPCC__)               /* hipcc defines this */
#  include <hip/hip_runtime.h>       /* brings in hipError_t, hipMemcpy*, hipStream_t, … */

/* ────────────────────────────────────────────────────────────────
   Otherwise we are on NVCC (or some other CUDA toolchain).
   Map the HIP symbols to their CUDA twins so the same source compiles.
   ──────────────────────────────────────────────────────────────── */
#else   /* __CUDACC__ is almost certainly defined here */

#  include <cuda_runtime.h>          /* get cudaError_t etc. */

   /* simple typedef/define shims */
   #define hipEvent_t               cudaEvent_t
   #define hipError_t               cudaError_t
   #define hipSuccess               cudaSuccess

   #define hipEventCreate           cudaEventCreate
   #define hipEventRecord           cudaEventRecord
   #define hipEventSynchronize      cudaEventSynchronize
   #define hipEventElapsedTime      cudaEventElapsedTime
   #define hipEventDestroy          cudaEventDestroy

   #define hipMalloc                cudaMalloc
   #define hipFree                  cudaFree
   #define hipMemcpy                cudaMemcpy
   #define hipMemcpyHostToDevice    cudaMemcpyHostToDevice
   #define hipMemcpyDeviceToHost    cudaMemcpyDeviceToHost
   #define hipMemcpyDeviceToDevice  cudaMemcpyDeviceToDevice
   #define hipMemset                cudaMemset

   #define hipDeviceSynchronize     cudaDeviceSynchronize
   #define hipDeviceGetAttribute    cudaDeviceGetAttribute
   #define hipDeviceAttributeMaxGridDimX  cudaDevAttrMaxGridDimX
   #define hipDeviceAttributeMaxBlockDimX cudaDevAttrMaxBlockDimX
   #define hipDeviceCanAccessPeer   cuDeviceCanAccessPeer
   #define hipDeviceEnablePeerAccess cuCtxEnablePeerAccess   /* or cudaDeviceEnablePeerAccess on new CUDA */
   #define hipSetDevice             cudaSetDevice

   #define hipStream_t              cudaStream_t
   #define hipStreamCreate          cudaStreamCreate
   #define hipStreamDestroy         cudaStreamDestroy
#endif

#endif /* HIP_TO_CUDA_H */
