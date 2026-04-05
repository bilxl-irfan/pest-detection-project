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
/* ── CUDA toolchain branch ───────────────────────────────────────── */
#else   /* building with NVCC / any CUDA compiler */

#  include <cuda_runtime.h>

/* basic types & status */
#  define hipEvent_t               cudaEvent_t
#  define hipStream_t              cudaStream_t
#  define hipError_t               cudaError_t
#  define hipSuccess               cudaSuccess
#  define hipGetErrorString        cudaGetErrorString          /* <── NEW */

/* memory & memcpy */
#  define hipMalloc                cudaMalloc
#  define hipFree                  cudaFree
#  define hipMemcpy                cudaMemcpy
#  define hipMemcpy2D              cudaMemcpy2D                
#  define hipMemcpy2DAsync          cudaMemcpy2DAsync     
#  define hipMemcpyHostToDevice    cudaMemcpyHostToDevice
#  define hipMemcpyDeviceToHost    cudaMemcpyDeviceToHost
#  define hipMemcpyDeviceToDevice  cudaMemcpyDeviceToDevice
#  define hipMemset                cudaMemset

/* events */
#  define hipEventCreate           cudaEventCreate
#  define hipEventRecord           cudaEventRecord
#  define hipEventSynchronize      cudaEventSynchronize
#  define hipEventElapsedTime      cudaEventElapsedTime
#  define hipEventDestroy          cudaEventDestroy

/* device & peer-access */
#  define hipDeviceSynchronize     cudaDeviceSynchronize
#  define hipDeviceGetAttribute    cudaDeviceGetAttribute
#  define hipDeviceAttributeMaxGridDimX   cudaDevAttrMaxGridDimX
#  define hipDeviceAttributeMaxBlockDimX  cudaDevAttrMaxBlockDimX
#  define hipSetDevice             cudaSetDevice
#  define hipDeviceCanAccessPeer   cudaDeviceCanAccessPeer     /* <── FIX */
#  define hipDeviceEnablePeerAccess cudaDeviceEnablePeerAccess /* <── FIX */

/* streams */
#  define hipStreamCreate          cudaStreamCreate
#  define hipStreamDestroy         cudaStreamDestroy
#endif  /* __HIPCC__ / __CUDACC__ */

#endif /* HIP_TO_CUDA_H */
