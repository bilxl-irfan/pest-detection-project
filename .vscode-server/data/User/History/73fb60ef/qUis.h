#ifndef HIP_TO_CUDA_H
#define HIP_TO_CUDA_H

#if defined(__CUDACC__) || !defined(__HIPCC__)

    #define hipEvent_t cudaEvent_t
    #define hipSuccess cudaSuccess
    #define hipEventRecord cudaEventRecord
    #define hipEventSynchronize cudaEventSynchronize
    #define hipEventElapsedTime cudaEventElapsedTime
    #define hipEventCreate cudaEventCreate
    #define hipEventDestroy cudaEventDestroy
    #define hipMalloc cudaMalloc
    #define hipMemcpy cudaMemcpy
    #define hipMemcpyHostToDevice cudaMemcpyHostToDevice
    #define hipFree cudaFree
    #define hipDeviceSynchronize cudaDeviceSynchronize
    #define hipDeviceAttributeMaxGridDimX cudaDevAttrMaxGridDimX
    #define hipDeviceAttributeMaxBlockDimX cudaDevAttrMaxBlockDimX
    #define hipDeviceGetAttribute cudaDeviceGetAttribute

#endif

#endif