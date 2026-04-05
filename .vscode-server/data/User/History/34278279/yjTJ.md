---
title: ROCm Blogs
myst:
html_meta:
"description lang=en": "AMD ROCm™ software blogs"
"keywords": "AMD GPU, MI300, MI250, ROCm, blog"
"property=og:locale": "en_US"
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');


.bd-page-width {
    max-width: 1440px !important;
    width: 100% !important;
    margin: 0 auto !important;
    contain: layout style; 
}

.bd-main .bd-content .bd-article-container {
    max-width: 1440px !important;
    width: 100% !important;
    margin: 0 auto !important;
    contain: layout; 
}

@media (min-width: 1200px) {
    .bd-main .bd-content .bd-article-container .bd-article {
        padding-left: 2rem;
        padding-top: 0px;
    }
}

.bd-container {
    max-width: 1440px !important;
    width: 100% !important;
    margin: 0 auto !important;
    contain: layout style; 
}

.bd-sidebar-secondary {
    display: none;
}

label.sidebar-toggle.secondary-toggle.btn.btn-sm {
    display: none;
}

label.sidebar-toggle primary-toggle btn btn-sm {
    display: none;
}

#buttonWrapper {
    border: none;
    background-color: var(--card-bg-light);
    box-shadow: 0 4px 12px var(--shadow-light);
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    border-radius: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    padding: 10px 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--text-color-light);
    cursor: pointer;
    display: flex;
    align-items: center;
    min-width: 100px;
    white-space: nowrap;
    will-change: transform, box-shadow; 
    transform: translateZ(0); 
    backface-visibility: hidden; 
    touch-action: manipulation; 
}

#buttonWrapper:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px var(--hover-shadow-light);
}

#buttonWrapper::after {
    content: "→";
    margin-left: 8px;
    transition: transform 0.2s ease;
    
    will-change: transform; 
}

#buttonWrapper:hover::after {
    transform: translateX(4px);
}

html[data-theme="dark"] #buttonWrapper {
    background-color: var(--card-bg-dark);
    box-shadow: 0 4px 12px var(--shadow-dark);
    color: var(--text-color-dark);
}

html[data-theme="dark"] #buttonWrapper:hover {
    box-shadow: 0 8px 24px var(--hover-shadow-dark);
}

h2 {
    margin: 0;
    font-size: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 15px;
    text-rendering: optimizeSpeed; 
}

.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px 20px;
    box-sizing: border-box;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
    contain: layout style; 
}


@media (max-width: 576px) {
    .container {
        justify-content: center;
        text-align: center;
    }
    
    .container h2 {
        width: 100%;
        margin-bottom: 15px;
        text-align: center;
    }
    
    #buttonWrapper {
        margin: 0 auto;
    }
}

html[data-theme="dark"] .container {
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.read-more-btn {
    font-size: 20px;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    display: inline-block;
    align-items: center;
    text-decoration: none;
    overflow: hidden;
    gap: 7px;
    display: block;
    text-align: left;
    margin-left: 0;
    margin-top: 10px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    
    will-change: transform; 
    transform: translateZ(0); 
}

.read-more-btn-small {
    font-size: 15px;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    display: inline-block;
    align-items: center;
    text-decoration: none;
    overflow: hidden;
    gap: 7px;
    display: block;
    text-align: left;
    margin-left: 0;
    margin-top: 10px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    
    will-change: transform; 
    transform: translateZ(0); 
}

.arrows {
    font-size: 20px;
    display: inline-block;
    font-weight: bold;
    transition: transform 0.3s ease, color 0.3s ease, font-size 0.3s ease;
    
    will-change: transform; 
}

.read-more-btn:hover .arrows {
    transform: translateX(8px);
}

.arrows-small {
    font-size: 15px;
    display: inline-block;
    font-weight: bold;
    transition: transform 0.3s ease, color 0.3s ease, font-size 0.3s ease;
    
    will-change: transform; 
}

.read-more-btn-small:hover .arrows-small {
    transform: translateX(10px);
}

:root {
    --card-bg-light: white;
    --card-bg-dark: #1e1e1e;
    --text-color-light: #333;
    --text-color-dark: #e0e0e0;
    --shadow-light: rgba(0, 0, 0, 0.08);
    --shadow-dark: rgba(0, 0, 0, 0.3);
    --hover-shadow-light: rgba(0, 0, 0, 0.12);
    --hover-shadow-dark: rgba(0, 0, 0, 0.5);
    --paragraph-color-light: #555;
    --paragraph-color-dark: #b0b0b0;
    --link-hover-light: #0066cc;
    --link-hover-dark: #4d9fff;
}

.sd-card {
    border-radius: 0 !important;
    box-shadow: 0 4px 12px var(--shadow-light) !important;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
    overflow: hidden;
    margin-bottom: 20px;
    background-color: var(--card-bg-light);
    border: none !important;
    height: 400px !important; 
    display: flex !important;
    flex-direction: column !important;
    will-change: transform, box-shadow; 
    transform: translateZ(0) !important; 
    backface-visibility: hidden; 
    contain: layout style; 
}

.sd-card:hover {
    transform: translateY(-2px) scale(1.02) translateZ(0) !important;
    box-shadow: 0 8px 20px var(--hover-shadow-light) !important;
}

.small-sd-card-img-top.sd-card-img-top {
    width: 100%;
    height: 250px;
    object-fit: cover;
    margin: 0 !important;
    padding: 0 !important;
    display: block;
    border-bottom: none !important;
    border-radius: 0 !important;
    flex-shrink: 0 !important;
    content-visibility: auto; 
    will-change: transform, filter; 
    contain: layout paint style; 
    transition: filter 0.2s ease-in-out, opacity 0.3s ease-in-out !important;
    background-color: #f5f5f5; /* Light gray placeholder background */
    opacity: 1;
}

/* Add dark mode background placeholder */
html[data-theme="dark"] .small-sd-card-img-top.sd-card-img-top {
    background-color: #2a2a2a; /* Dark gray placeholder for dark mode */
}

/* Style for images that are still loading */
.small-sd-card-img-top.sd-card-img-top.loading {
    opacity: 0;
}

.sd-card:hover .small-sd-card-img-top.sd-card-img-top {
    filter: blur(0.05px) brightness(0.97);
}

.small-sd-card.sd-card-body {
    display: none;
    padding: 0 !important;
    margin: 0 !important;
    height: 0 !important;
}

.sd-card-footer {
    border-top: none !important;
    background-color: var(--card-bg-light) !important;
    padding: 16px !important;
    flex-grow: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    
    contain: content; 
}

.sd-col {
    padding: 8px !important;
    display: flex !important;
    
    contain: layout style; 
    
    animation: none !important;
    transform: none !important;
    transition: none !important;
}

.card-header {
    font-size: 18px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 15px;
    color: var(--text-color-light);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-rendering: optimizeSpeed; 
}

.small-card-header-link h2 {
    font-weight: 700 !important;
}

.small-card-header-link {
    text-decoration: none !important;
}

.small-card-header-link:hover h2 {
    color: var(--link-hover-light);
}

.paragraph {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 15px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--paragraph-color-light);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-rendering: optimizeSpeed; 
}

.date {
    font-size: 13px;
    font-weight: 300;
    line-height: 1.5;
    text-transform: none;
    margin-bottom: 15px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin-top: auto;
    max-width: 100% !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    word-wrap: break-word !important;
}

.date a {
    display: inline !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
}

html[data-theme="dark"] .sd-card {
    background-color: var(--card-bg-dark) !important;
    box-shadow: 0 4px 12px var(--shadow-dark) !important;
}

html[data-theme="dark"] .sd-card:hover {
    box-shadow: 0 8px 24px var(--hover-shadow-dark) !important;
}

html[data-theme="dark"] .sd-card-footer {
    background-color: var(--card-bg-dark) !important;
}

html[data-theme="dark"] .card-header {
    color: var(--text-color-dark);
}

html[data-theme="dark"] .paragraph {
    color: var(--paragraph-color-dark);
}

html[data-theme="dark"] .small-card-header-link:hover h2 {
    color: var(--link-hover-dark);
}

html[data-theme="dark"] .container h2 {
    color: var(--text-color-dark);
}

html[data-theme="dark"] .date {
    color: var(--paragraph-color-dark);
}

@media (min-width: 1220px) {
    .sd-card {
        height: 520px !important;
    }
    
    .paragraph {
        -webkit-line-clamp: 3;
        display: -webkit-box;
    }
    
    .card-header {
        -webkit-line-clamp: 3;
    }

    .sd-row > [class*="sd-col"] {
        flex: 0 0 25% !important;
        max-width: 25% !important;
    }
}

@media (min-width: 1024px) and (max-width: 1220px) {
    .sd-card {
        height: 510px !important;
    }
    
    .paragraph {
        -webkit-line-clamp: 3;
        display: -webkit-box;
    }
    
    .card-header {
        -webkit-line-clamp: 3;
    }

    .sd-row > [class*="sd-col"] {
        flex: 0 0 33.333333% !important;
        max-width: 33.333333% !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .sd-card {
        height: 490px !important;
    }
    
    .paragraph {
        -webkit-line-clamp: 4;
        display: -webkit-box;
    }
    
    .card-header {
        -webkit-line-clamp: 2;
    }
}

@media (min-width:576px) and (max-width: 1024px) {
    .sd-card {
        height: 470px !important;
    }
    
    .paragraph {
        -webkit-line-clamp: 3;
        display: -webkit-box;
    }
    
    .card-header {
        -webkit-line-clamp: 3;
        font-size: 16px;
    }

    .sd-row > [class*="sd-col"] {
        flex: 0 0 50% !important;
        max-width: 50% !important;
    }
}

@media (max-width: 575px) {
    .sd-card {
        height: 510px !important;
    }
    
    .paragraph {
        -webkit-line-clamp: 3;
        display: -webkit-box;
    }
    
    .card-header {
        -webkit-line-clamp: 2;
        font-size: 16px;
    }

    .sd-row > [class*="sd-col"] {
        flex: 0 0 100% !important;
        max-width: 100% !important;
    }
}

.bd-sidebar-primary {
    display: none;
}

.sidebar-toggle {
    display: none;
}

label.sidebar-toggle.primary-toggle.btn.btn-sm {
    display: none;
}

.sd-container-fluid {
    padding: 0 10px;
    max-width: 1440px;
    margin: 0 auto;
    
    contain: layout style; 
}

.sd-row {
    margin: 0 -10px;
    display: flex;
    flex-wrap: wrap;
    
    contain: layout; 
}

@media (max-width: 1440px) {
    .bd-page-width, 
    .bd-main .bd-content .bd-article-container,
    .bd-container,
    .container,
    .sd-container-fluid {
        max-width: 100% !important;
    }
}

.container h2 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: var(--text-color-light);
    
    text-rendering: optimizeSpeed; 
}


@media (prefers-reduced-motion: reduce) {
    .sd-card,
    #buttonWrapper,
    #buttonWrapper::after,
    .arrows,
    .arrows-small,
    .read-more-btn:hover .arrows,
    .read-more-btn-small:hover .arrows-small {
        transition: none !important;
        animation: none !important;
    }
}


img {
    content-visibility: auto;
}

/* Add JavaScript to handle image loading transitions */
@media (min-width: 1px) {
    /* This ensures the script is added to all screen sizes */
    body::after {
        content: "";
        display: none;
    }
    
    /* Add a script to handle lazy loading transitions */
    body::before {
        content: "";
        display: none;
    }
    
    /* This script will be executed when the page loads */
    body::after {
        content: "";
        display: none;
    }
    
    /* Add a script element to the page */
    script {
        display: none;
    }
}

/* Add this to the end of the file to ensure it's included */
@media (min-width: 1px) {
    body::after {
        content: "";
        display: none;
    }
}


@media (prefers-reduced-motion: no-preference) {
    .sd-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
}

.banner-slider {
    position: relative;
    width: 100%;
    max-width: 1750px;
    margin: 0 auto 40px;
    overflow: hidden;
    border-radius: 0;
    background-color: var(--card-bg-light);
    will-change: transform;
    transform: translateZ(0); 
    transition: all 0.3s ease;
}

.banner-slider__mobile {
    display: none;
    will-change: transform;
}

.banner-slider__mobile-progress {
    display: none;
}

html[data-theme="dark"] .banner-slider {
    background-color: var(--card-bg-dark);
}

.banner-slider__inner {
    position: relative;
    display: flex;
    width: 100%;
    will-change: transform;
    transition: all 0.3s ease;
}

.banner-slide {
    flex: 0 0 100%;
    display: none;
    flex-direction: row;
    width: 100%;
    min-height: 180px;
    position: relative;
    will-change: opacity, transform;
    backface-visibility: hidden;
    transition: min-height 0.3s ease, flex 0.3s ease;
    overflow: hidden;
}

.banner-slide__text {
    flex: 0 0 60%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: flex 0.3s ease, padding 0.3s ease;
    max-width: 60%;
    box-sizing: border-box;
}

.banner-slide__category {
    margin-bottom: 8px;
}

.banner-slide__category a {
    font-size: 13px;
    font-weight: 600;
    color: #6c757d;
    text-decoration: none;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    transition: font-size 0.3s ease;
}

.banner-slide__title {
    margin-bottom: 10px;
}

.banner-slide__title a {
    text-decoration: none;
}

.banner-slide__title h2 {
    font-size: 42px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
    color: var(--text-color-light);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: font-size 0.3s ease;
}

.banner-slide__description {
    margin-bottom: 8px;
}

.banner-slide__description p {
    font-size: 14px;
    line-height: 1.5;
    color: var(--paragraph-color-light);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: font-size 0.3s ease, -webkit-line-clamp 0.3s ease;
    text-rendering: optimizeSpeed;
}

.banner-slide__author {
    margin-bottom: 15px;
}

.banner-slide__author span {
    font-size: 13px;
    font-weight: 300;
    line-height: 1.5;
    text-transform: none;
    color: var(--paragraph-color-light);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    transition: font-size 0.3s ease;
}

.banner-slide__author span a {
    display: inline;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

html[data-theme="dark"] .banner-slide__title h2 {
    color: var(--text-color-dark);
}

html[data-theme="dark"] .banner-slide__description p {
    color: var(--paragraph-color-dark);
}

html[data-theme="dark"] .banner-slide__author span {
    color: var(--paragraph-color-dark);
}

html[data-theme="dark"] .banner-slide__author span a {
    color: var(--paragraph-color-dark);
}

.banner-slide__title__link a,
.banner-slide__read-now-btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #e23744;
    color: white;
    text-decoration: none;
    border-radius: 0;
    font-weight: 600;
    font-size: 14px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin-top: 15px;
    will-change: transform;
    transform: translateZ(0);
    transition: padding 0.3s ease, font-size 0.3s ease;
}

.banner-slide__read-now-btn {
    background-color: #e23744;
    padding: 8px 16px;
    margin-top: 15px;
    display: none;
    box-shadow: none !important;
    border: none !important;
}

.banner-slide__thumbnail {
    flex: 0 0 40%;
    position: relative;
    overflow: hidden;
    padding: 20px;
    transition: flex 0.3s ease, padding 0.3s ease;
    max-width: 40%;
    box-sizing: border-box;
}

.banner-slide__thumbnail-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 45%; 
    overflow: hidden;
    border-radius: 0;
    transition: padding-bottom 0.3s ease;
    max-width: 100%;
}

.banner-slide__thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translateZ(0);
    will-change: transform;
    transition: all 0.3s ease;
    max-width: 100%;
}

.banner-slider__navigation {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
    z-index: 5;
    transition: all 0.3s ease;
}

html[data-theme="dark"] .banner-slider__navigation {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.banner-slider__nav-item {
    flex: 1 1 0;
    min-width: 0;
    max-width: 20%;
    position: relative;
    padding: 15px 10px;
    cursor: pointer;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    height: auto;
    display: flex;
    flex-direction: column;
    will-change: opacity;
    transition: all 0.3s ease;
}

html[data-theme="dark"] .banner-slider__nav-item {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.banner-slider__nav-item:last-child {
    border-right: none;
}

.banner-slider__nav-item.active {
    background-color: rgba(0, 0, 0, 0.05);
}

html[data-theme="dark"] .banner-slider__nav-item.active {
    background-color: rgba(255, 255, 255, 0.05);
}

.banner-slider__nav-progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 3px;
    width: 0;
    background-color: #e23744;
    transition: width 8s linear, opacity 0.3s ease;
    opacity: 1;
    will-change: width, opacity;
    transform: translateZ(0);
}

.banner-slider__nav-title {
    font-size: 14px;
    font-weight: 600;
    color: #6c757d;
    margin-bottom: 6px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    transition: font-size 0.3s ease;
}

.banner-slider__nav-category {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color-light);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    display: block;
    overflow: visible;
    height: auto;
    line-height: 1.3;
    flex-grow: 1;
    word-wrap: break-word;
    transition: font-size 0.3s ease;
}

html[data-theme="dark"] .banner-slider__nav-category {
    color: var(--text-color-dark);
}

.banner-slider__nav-btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border: none;
    background: transparent;
    touch-action: manipulation;
    z-index: 10;
}

@media (max-width: 1200px) {
    .banner-slide {
        min-height: 170px;
    }
    
    .banner-slide__title h2 {
        font-size: 24px;
    }
    
    .banner-slide__description p {
        font-size: 15px;
        -webkit-line-clamp: 3;
    }
    
    .banner-slide__author span {
        font-size: 13px;
    }

    .banner-slider__nav-category {
        font-size: 15px;
    }

    .banner-slider__nav-item {
        min-height: 100px;
    }
}

@media (max-width: 1000px) {
    .banner-slide__description p {
        font-size: 14px;
        -webkit-line-clamp: 2;
    }
    
    .banner-slider__nav-category {
        font-size: 14px;
    }

    .banner-slider__nav-item {
        min-height: 120px;
    }
}

@media (max-width: 800px) {
    .banner-slider__nav-category {
        font-size: 13px;
    }

    .banner-slider__nav-item {
        min-height: 130px;
    }
}

@media (max-width: 700px) {
    .banner-slider__nav-category {
        font-size: 12px;
    }

    .banner-slider__nav-item {
        min-height: 140px;
    }
}

@media (min-width: 992px) {
    .banner-slide {
        min-height: 350px;
    }

    .banner-slide__text {
        flex: 0 0 50%;
        max-width: 50%;
    }

    .banner-slide__thumbnail {
        flex: 0 0 50%;
        max-width: 50%;
    }

    .banner-slide__thumbnail-container {
        padding-bottom: 60%;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .banner-slide {
        min-height: 300px;
    }
    
    .banner-slide__title h2 {
        font-size: 22px;
    }
    
    .banner-slide__description p {
        font-size: 14px;
        -webkit-line-clamp: 2;
    }
    
    .banner-slide__author span {
        font-size: 12px;
    }
}

@media (max-width: 600px) {
    .banner-slider__desktop {
        display: none;
    }
    
    .banner-slider__mobile {
        display: block;
        background-color: var(--card-bg-light);
        color: var(--text-color-light);
        position: relative;
        border-radius: 0;
        overflow: hidden;
        will-change: transform;
        transform: translateZ(0);
    }
    
    html[data-theme="dark"] .banner-slider__mobile {
        background-color: var(--card-bg-dark);
        color: var(--text-color-dark);
    }

    .banner-slider__mobile-slide {
        padding: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        will-change: opacity, transform;
        backface-visibility: hidden;
        overflow: hidden; 
    }

    .banner-slider__mobile-title {
        margin-bottom: 15px;
        order: -1;
    }
    
    .banner-slider__mobile-title h2 {
        color: var(--text-color-light);
        font-size: 24px;
        margin: 10px 0;
        font-weight: 700;
        line-height: 1.3;
    }
    
    html[data-theme="dark"] .banner-slider__mobile-title h2 {
        color: var(--text-color-dark);
    }
    
    .banner-slider__mobile-description {
        margin-bottom: 8px;
    }
    
    .banner-slider__mobile-description p {
        font-size: 14px;
        line-height: 1.5;
        color: var(--paragraph-color-light);
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        text-rendering: optimizeSpeed;
    }
    
    html[data-theme="dark"] .banner-slider__mobile-description p {
        color: var(--paragraph-color-dark);
    }
    
    .banner-slider__mobile-author {
        margin-bottom: 10px;
    }
    
    .banner-slider__mobile-author span {
        font-size: 12px;
        font-weight: 300;
        line-height: 1.5;
        text-transform: none;
        color: var(--paragraph-color-light);
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
    }
    
    .banner-slider__mobile-author span a {
        display: inline;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
    
    html[data-theme="dark"] .banner-slider__mobile-author span {
        color: var(--paragraph-color-dark);
    }
    
    html[data-theme="dark"] .banner-slider__mobile-author span a {
        color: var(--paragraph-color-dark);
    }

    .banner-slider__mobile-image {
        margin-bottom: 15px;
        padding: 0;
        width: 100%;
        overflow: hidden;
    }
    
    .banner-slider__mobile-image .banner-slide__thumbnail {
        padding: 0;
        margin: 0;
        width: 100%;
        max-width: 100%;
    }
    
    .banner-slider__mobile-image .banner-slide__thumbnail-container {
        margin-bottom: 0;
        padding-bottom: 66.67%;
        border-radius: 0;
        max-width: 100%;
    }

    .banner-slider__mobile-button {
        display: inline-block;
        background-color: #6c757d;
        color: white !important;
        padding: 8px 16px;
        border-radius: 0;
        text-decoration: none;
        font-weight: 600;
        font-size: 13px;
        margin-top: 10px;
        align-self: flex-start;
        box-shadow: none !important;
        border: none !important;
        will-change: transform;
        transform: translateZ(0);
    }
    
    .banner-slider__mobile-button * {
        color: white !important;
    }
    
    .banner-slider__mobile-dots {
        display: flex;
        justify-content: space-between;
        margin: 20px 20px 0;
        padding: 10px 0;
        position: relative;
        z-index: 5;
    }

    .banner-slider__mobile-dot {
        flex: 1;
        height: 4px;
        background-color: #e23744;
        margin: 0 3px;
        position: relative;
        cursor: pointer;
        border-radius: 0;
        overflow: hidden;
        will-change: background-color;
        transform: translateZ(0);
    }
    
    html[data-theme="dark"] .banner-slider__mobile-dot {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .banner-slider__mobile-dot.active {
        background-color: rgba(0, 0, 0, 0.15);
    }
    
    html[data-theme="dark"] .banner-slider__mobile-dot.active {
        background-color: rgba(255, 255, 255, 0.15);
    }

    .banner-slider__mobile-dot::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: var(--progress-width, 0%);
        background-color: #6c757d;
        transition: width 5s linear;
        will-change: width;
        transform: translateZ(0);
    }

    .banner-slider__mobile-dot:not(.active)::after {
        transition: none;
    }

    .banner-slider__mobile-progress {
        display: none;
    }

    .banner-slider__navigation {
        display: none;
    }

    .banner-slide__text {
        padding: 15px 15px 10px 15px;
    }
    
    .banner-slide__thumbnail {
        padding: 0 15px 15px 15px;
    }
    
    .banner-slide__title h2 {
        font-size: 18px;
    }
    
    .banner-slide__description p {
        font-size: 14px;
        -webkit-line-clamp: 2;
    }
    
    .banner-slide__author span {
        font-size: 12px;
    }

    .banner-slider::after {
        height: 3px;
    }

    .banner-slider__nav-category {
        font-size: 11px;
    }

    .banner-slider__nav-item {
        min-height: 150px;
    }
}

@media (max-width: 375px) {
    .banner-slider__nav-category {
        font-size: 10px;
    }
    
    .banner-slider__nav-item {
        min-height: 160px;
    }

    .banner-slide__text {
        padding: 12px 12px 8px 12px;
    }
    
    .banner-slide__thumbnail {
        padding: 0 12px 12px 12px;
    }
    
    .banner-slide__title h2 {
        font-size: 16px;
    }
    
    .banner-slide__description p {
        font-size: 12px;
        -webkit-line-clamp: 2;
    }
    
    .banner-slide__author span {
        font-size: 11px;
    }
    
    .banner-slide__title__link a {
        padding: 6px 12px;
        font-size: 12px;
    }

    .banner-slider::after {
        height: 2px;
    }
}

/* Add support for reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
    .banner-slide,
    .banner-slider__nav-progress-bar,
    .banner-slider__mobile-dot::after,
    .banner-slide__title__link a,
    .banner-slide__read-now-btn,
    .banner-slider__mobile-button,
    .banner-slide__text,
    .banner-slide__thumbnail,
    .banner-slide__thumbnail-container,
    .banner-slide__title h2,
    .banner-slide__description p,
    .banner-slide__author span {
        transition: none !important;
        animation: none !important;
    }
}

</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/_static/css/theme.css" as="style">
<link rel="preload" href="/_static/css/index.css" as="style">
<link rel="preload" href="/_static/css/bootstrap.min.css" as="style">
<link rel="preload" href="/_static/js/performance.js" as="script">
<link rel="preload" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" as="style">
<meta http-equiv="Accept-Encoding" content="gzip, deflate, br">

<script>
    if (window.performance && window.performance.mark) {
        window.performance.mark('index-start');
    } 
</script>

<script src="/_static/js/performance.js" defer></script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.performance && window.performance.mark) {
        window.performance.mark('dom-content-loaded');
        window.performance.measure('dom-processing', 'posts-start', 'dom-content-loaded');
    }
    
    const scheduleIdleTask = (callback) => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(callback, { timeout: 2000 });
        } else {
            setTimeout(callback, 1);
        }
    };
    
    const scheduleAnimation = (callback) => {
        return window.requestAnimationFrame(callback);
    };
    
    function wrapImagesWithContainer() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            
            if (img.parentNode.classList.contains('image-container')) return;

            const container = document.createElement('div');
            container.className = 'image-container';

            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';

            img.parentNode.insertBefore(container, img);
            container.appendChild(placeholder);
            container.appendChild(img);

            const hash = img.dataset.src.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);

            const hue = Math.abs(hash % 360);
            const saturation = 15 + Math.abs((hash >> 8) % 20);
            const lightness = 85 + Math.abs((hash >> 16) % 10);
            
            placeholder.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        });
    }
    
    if ('IntersectionObserver' in window) {
        const uniqueDomains = new Set();
        document.querySelectorAll('img[data-src]').forEach(img => {
            try {
                const url = new URL(img.dataset.src);
                uniqueDomains.add(url.origin);
            } catch (error) {
            }
        });
      
        uniqueDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });

        wrapImagesWithContainer();

        const lazyImages = document.querySelectorAll('img[data-src]');
        
        // Preload images before they enter viewport
        const preloadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                const imgUrl = img.dataset.src;
                
                if (window.performance && window.performance.mark) {
                window.performance.mark(`image-preload-start-${imgUrl}`);
                }

                const preloader = new Image();
                preloader.onload = function() {

                img.dataset.preloaded = 'true';
                
                if (window.performance && window.performance.mark) {
                    window.performance.mark(`image-preload-end-${imgUrl}`);
                    window.performance.measure(
                        `image-preload-time-${imgUrl}`,
                        `image-preload-start-${imgUrl}`,
                        `image-preload-end-${imgUrl}`
                    );
                }
                };
                preloader.src = imgUrl;

                observer.unobserve(img);
            }
            });
        }, {
            rootMargin: '1500px 0px',
            threshold: 0.01,
        });

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (window.performance && window.performance.mark) {
                window.performance.mark(`image-display-start-${img.dataset.src}`);
                }
                
                img.src = img.dataset.src;

                setTimeout(() => {
                img.classList.add('loaded');

                const placeholder = img.previousElementSibling;
                if (placeholder && placeholder.classList.contains('image-placeholder')) {
                    placeholder.classList.add('lqip-hidden');
                }

                if (window.performance && window.performance.mark) {
                    window.performance.mark(`image-display-end-${img.dataset.src}`);
                    window.performance.measure(
                        `image-display-time-${img.dataset.src}`,
                        `image-display-start-${img.dataset.src}`,
                        `image-display-end-${img.dataset.src}`
                    );
                }
                
                img.removeAttribute('data-src');
                img.removeAttribute('data-preloaded');
                }, 50);
                
                observer.unobserve(img);
            }
            });
        }, {
            rootMargin: '300px 0px',
            threshold: 0.01,
        });

        lazyImages.forEach(img => {
            preloadObserver.observe(img);
            imageObserver.observe(img);
        });
        } else {
        scheduleIdleTask(() => {
            wrapImagesWithContainer();
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
            const placeholder = img.previousElementSibling;
            
            const tempImage = new Image();
            tempImage.onload = function() {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                if (placeholder && placeholder.classList.contains('image-placeholder')) {
                    placeholder.classList.add('lqip-hidden');
                }
                img.removeAttribute('data-src');
            };
            tempImage.src = img.dataset.src;
            });
        });
    }

    scheduleAnimation(() => {
        const gridItems = document.querySelectorAll('.sd-col');
        gridItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
        });
    });

    if (window.performance && window.performance.getEntriesByType) {
        scheduleIdleTask(() => {
            const perfEntries = performance.getEntriesByType('measure');

            console.log('Performance metrics:', perfEntries);

            if (window.navigator.sendBeacon) {
                try {
                    const metrics = JSON.stringify(perfEntries);
                    navigator.sendBeacon('/analytics', metrics);
                } catch (error) {
                    console.error('Failed to send performance metrics', error);
                }
            }
        });
    }
  });

    window.addEventListener('scroll', function() {
    }, { passive: true });

    window.addEventListener('load', function() {
        if (window.performance && window.performance.mark) {
            window.performance.mark('posts-fully-loaded');
            window.performance.measure('full-page-load', 'posts-start', 'posts-fully-loaded');

            const loadTime = performance.getEntriesByName('full-page-load')[0].duration;
            console.log(`Page fully loaded in ${loadTime.toFixed(2)}ms`);
        }
    });
</script>

<div class="container">
<h2>Featured Posts</h2>
</div>

.. carousel::
   :controls:
   :indicators:
   :interval: 5000

   .. figure:: artificial-intelligence/mlperf-training-v5.0/images/MLPerf-Training-v5.0-submission.webp
      :target: ./artificial-intelligence/mlperf-training-v5.0/README.html
      :alt: AMD's MLPerf Training Debut: Optimizing LLM Fine-Tuning with Instinct™ GPUs
      
      **AMD's MLPerf Training Debut: Optimizing LLM Fine-Tuning with Instinct™ GPUs**
      
      Explore the techniques we used to improve the training performance on MI300X and MI325X in our MLPerf Training 5.0 submission.

   .. figure:: artificial-intelligence/DeepSeekR1_Perf/images/whale.webp
      :target: ./artificial-intelligence/DeepSeekR1_Perf/README.html
      :alt: Unlock DeepSeek-R1 Inference Performance on AMD Instinct™ MI300X GPU
      
      **Unlock DeepSeek-R1 Inference Performance on AMD Instinct™ MI300X GPU**
      
      This blog introduces the key performance optimizations made to enable DeepSeek-R1 Inference

<div class="container">
    <h2>Recent Posts</h2>
    <a href="posts.html">
        <button id="buttonWrapper">
            See All
        </button>
    </a>
</div>

::::{grid} 1 2 3 4
:margin 2

:::{grid-item-card}
:padding: 1
:img-top: ecosystems-and-partners/rocm-revisited-power/images/supercomputing.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./ecosystems-and-partners/rocm-revisited-power/README.html" class="small-card-header-link">
    <h2 class="card-header">AMD ROCm: Powering the World's Fastest Supercomputers</h2>
</a>
<p class="paragraph">Discover how ROCm drives the world’s top supercomputers, from El Capitan to Frontier, and why its shaping the future of scalable, open and sustainable HPC</p>
<div class="date">June 10, 2025 by <a href="https://rocm.blogs.amd.com/authors/mohammed-faraaz-mustafa.html">Mohammed Faraaz Mustafa</a>, <a href="https://rocm.blogs.amd.com/authors/saad-rahim.html">Saad Rahim</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: images/quark_LLM.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./artificial-intelligence/quark/README.html" class="small-card-header-link">
    <h2 class="card-header">LLM Quantization with Quark on AMD GPUs: Accuracy and Performance Evaluation</h2>
</a>
<p class="paragraph">Learn how to use Quark to apply FP8 quantization to LLMs on AMD GPUs, and evaluate accuracy and performance using vLLM and SGLang on AMD MI300X GPUs.</p>
<div class="date">June 09, 2025 by <a href="https://rocm.blogs.amd.com/authors/sean-song.html">Sean Song</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: ecosystems-and-partners/rocm-revisited-ecosy/images/rocm-revisited-ecosy.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./ecosystems-and-partners/rocm-revisited-ecosy/README.html" class="small-card-header-link">
    <h2 class="card-header">ROCm Revisited: Evolution of the High-Performance GPU Computing Ecosystem</h2>
</a>
<p class="paragraph">Learn how ROCm evolved to support HPC, AI, and containerized workloads with modern tools, libraries, and deployment options.</p>
<div class="date">June 06, 2025 by <a href="https://rocm.blogs.amd.com/authors/liam-berry.html">Liam Berry</a>, <a href="https://rocm.blogs.amd.com/authors/saad-rahim.html">Saad Rahim</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: ecosystems-and-partners/rocm-revisited/images/navigationblog.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./ecosystems-and-partners/rocm-revisited/README.html" class="small-card-header-link">
    <h2 class="card-header">Introducing the ROCm Revisited Series</h2>
</a>
<p class="paragraph">We present our ROCm Revisited Series. Discover ROCm's role in leading edge supercomputing, its growing ecosystem-from HIP, to developer tools-powering AI, HPC, and data science across multi-GPU and cluster systems</p>
<div class="date">June 06, 2025 by <a href="https://rocm.blogs.amd.com/authors/mohammed-faraaz-mustafa.html">Mohammed Faraaz Mustafa</a>, <a href="https://rocm.blogs.amd.com/authors/liam-berry.html">Liam Berry</a>, <a href="https://rocm.blogs.amd.com/authors/saad-rahim.html">Saad Rahim</a></div>
:::

::::

<div class="container">
    <h2>Ecosystems & Partners</h2>
    <a href="ecosystem-partners.html">
        <button id="buttonWrapper">
            See All
        </button>
    </a>
</div>

::::{grid} 1 2 3 4
:margin 2

:::{grid-item-card}
:padding: 1
:img-top: ecosystems-and-partners/rocm-revisited-hip/images/rocm-revisited-hip.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./ecosystems-and-partners/rocm-revisited-hip/README.html" class="small-card-header-link">
    <h2 class="card-header">ROCm Revisited: Getting Started with HIP</h2>
</a>
<p class="paragraph">New to HIP? This blog will introduce you to the HIP runtime API, its key concepts and installation and practical code examples to showcase its functionality.</p>
<div class="date">June 06, 2025 by <a href="https://rocm.blogs.amd.com/authors/liam-berry.html">Liam Berry</a>, <a href="https://rocm.blogs.amd.com/authors/mohammed-faraaz-mustafa.html">Mohammed Faraaz Mustafa</a>, <a href="https://rocm.blogs.amd.com/authors/saad-rahim.html">Saad Rahim</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: ecosystems-and-partners/llama-stack-on/images/3.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./ecosystems-and-partners/llama-stack-on/README.html" class="small-card-header-link">
    <h2 class="card-header">A Step-by-Step Guide On How To Deploy Llama Stack on AMD Instinct™ GPU</h2>
</a>
<p class="paragraph">Learn how to use Meta’s Llama Stack with AMD ROCm and vLLM to scale inference, integrate APIs, and streamline production-ready AI workflows on AMD Instinct™ GPU</p>
<div class="date">April 22, 2025 by <a href="https://rocm.blogs.amd.com/authors/alex-he.html">Alex He</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: artificial-intelligence/-opea-blog/images/OPEA_THUBMNAIL.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./artificial-intelligence/-opea-blog/README.html" class="small-card-header-link">
    <h2 class="card-header">AMD Advances Enterprise AI Through OPEA Integration</h2>
</a>
<p class="paragraph">We announce AMD’s support of Open Platform for Enterprise AI (OPEA), integrating OPEA’s enterprise GenAI framework with AMD’s computing hardware and ROCm software</p>
<div class="date">March 12, 2025 by <a href="https://rocm.blogs.amd.com/authors/yu-wang.html">Yu Wang</a>, <a href="https://rocm.blogs.amd.com/authors/alex-he.html">Alex He</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: ecosystems-and-partners/ansys-fluent-performance/images/Ansys_Fluent_benchmarks_Blog.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./ecosystems-and-partners/ansys-fluent-performance/README.html" class="small-card-header-link">
    <h2 class="card-header">Boosting Computational Fluid Dynamics Performance with AMD Instinct™ MI300X</h2>
</a>
<p class="paragraph">The blog introduces CFD Ansys Fluent benchmarks and provides hands-on guide on installing and running four different Fluent models on AMD GPUs using ROCm.</p>
<div class="date">January 14, 2025 by Martin Huarte</div>
:::

::::

<div class="container">
    <h2>Applications & Models</h2>
    <a href="applications-models.html">
        <button id="buttonWrapper">
            See All
        </button>
    </a>
</div>

::::{grid} 1 2 3 4
:margin 2

:::{grid-item-card}
:padding: 1
:img-top: artificial-intelligence/reproduce-mlperf-training-v5.0/images/MLPerf-Training-v5.0-reproduce.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./artificial-intelligence/reproduce-mlperf-training-v5.0/README.html" class="small-card-header-link">
    <h2 class="card-header">Reproduce AMD's MLPerf Training v5.0 Submission Result with Instinct™ GPUs</h2>
</a>
<p class="paragraph">Follow this step-by-step guide to reproduce AMDs MLPerf 5.0 Training Submission with Instinct GPUs using ROCm</p>
<div class="date">June 04, 2025 by Meena Arunachalam, Miro Hodak, Ravi Dwivedula, Su Ann Chong, Sarthak Arora, Sathish Sanjeevi, Karan Verma, <a href="https://rocm.blogs.amd.com/authors/eliot-li.html">Eliot Li</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: artificial-intelligence/bert-training/images/BERT-training-blog-thumbnail.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./artificial-intelligence/bert-training/README.html" class="small-card-header-link">
    <h2 class="card-header">High-Throughput BERT-L Pre-Training on AMD Instinct™ GPUs: A Practical Guide</h2>
</a>
<p class="paragraph">Learn how to optimize BERT-L training with mixed precision and Flash Attention v2 on AMD Instinct GPUs — follow our tested MLPerf-compliant step-by-step guide.</p>
<div class="date">June 03, 2025 by Meena Arunachalam, Miro Hodak, Ravi Dwivedula, Su Ann Chong, Sarthak Arora, Sathish Sanjeevi, Karan Verma, <a href="https://rocm.blogs.amd.com/authors/eliot-li.html">Eliot Li</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: artificial-intelligence/multinode-inference/images/scale-inference-thumbnail.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./artificial-intelligence/multinode-inference/README.html" class="small-card-header-link">
    <h2 class="card-header">Scale LLM Inference with Multi-Node Infrastructure</h2>
</a>
<p class="paragraph">Learn how to horizontally scale LLM inference using open-source tools on MI300X, with  vLLM, nginx, Prometheus, and Grafana.</p>
<div class="date">May 30, 2025 by Jorge Parada, <a href="https://rocm.blogs.amd.com/authors/eliot-li.html">Eliot Li</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: artificial-intelligence/llm-d-distributed/images/LLLMD.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./artificial-intelligence/llm-d-distributed/README.html" class="small-card-header-link">
    <h2 class="card-header">AMD Integrates llm-d on AMD Instinct MI300X Cluster For Distributed LLM Serving</h2>
</a>
<p class="paragraph">AMD Integrates llm-d on AMD Instinct MI300X Cluster For Distributed LLM Serving</p>
<div class="date">May 20, 2025 by <a href="https://rocm.blogs.amd.com/authors/kenny-roche.html">Kenny Roche</a>, <a href="https://rocm.blogs.amd.com/authors/joe-shajrawi.html">Joe Shajrawi</a>, <a href="https://rocm.blogs.amd.com/authors/andy-luo.html">Andy Luo</a>, <a href="https://rocm.blogs.amd.com/authors/anshul-gupta.html">Anshul Gupta</a></div>
:::

::::

<div class="container">
    <h2>Software Tools & Optimizations</h2>
    <a href="software-tools.html">
        <button id="buttonWrapper">
            See All
        </button>
    </a>
</div>

::::{grid} 1 2 3 4
:margin 2

:::{grid-item-card}
:padding: 1
:img-top: software-tools-optimization/amd-rocm-runfile/images/runfile-installer.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./software-tools-optimization/amd-rocm-runfile/README.html" class="small-card-header-link">
    <h2 class="card-header">ROCm Runfile Installer Is Here!</h2>
</a>
<p class="paragraph">Overview of ROCm Runfile Installer introduced in ROCm 6.4, allowing a complete single package for driver and ROCm installation without internet connectivity</p>
<div class="date">May 22, 2025 by Douglas Hamilton, <a href="https://rocm.blogs.amd.com/authors/saad-rahim.html">Saad Rahim</a>, <a href="https://rocm.blogs.amd.com/authors/liam-berry.html">Liam Berry</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: software-tools-optimization/ck-tile-flash/images/CK.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./software-tools-optimization/ck-tile-flash/README.html" class="small-card-header-link">
    <h2 class="card-header">From Theory to Kernel: Implement FlashAttention-v2 with CK-Tile</h2>
</a>
<p class="paragraph">Learn how to implement FlashAttention-v2 with CK-Tile: minimize memory overhead, maximize compute efficiency, and scale on AMD GPUs</p>
<div class="date">May 21, 2025 by Haocong Wang, Kevin Chang, David Li, <a href="https://rocm.blogs.amd.com/authors/george-wang.html">George Wang</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: software-tools-optimization/triton-distributed-c/images/BD.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./software-tools-optimization/triton-distributed-c/README.html" class="small-card-header-link">
    <h2 class="card-header">Unleash Full GPU Potential: Overlap Communication and Computation with Triton-Distributed</h2>
</a>
<p class="paragraph">Unlock the full power of AMD GPUs—write portable, efficient kernels with Triton-Distributed, overlapping computation and communication with ease and flexibility</p>
<div class="date">May 06, 2025 by Lei Zhang, <a href="https://rocm.blogs.amd.com/authors/george-wang.html">George Wang</a>, <a href="https://rocm.blogs.amd.com/authors/fan-wu.html">Fan Wu</a>, Peng Sun, Kyle Wang, <a href="https://rocm.blogs.amd.com/authors/anshul-gupta.html">Anshul Gupta</a></div>
:::


:::{grid-item-card}
:padding: 1
:img-top: software-tools-optimization/kernel-analysis-deep/images/Whale.webp
:class-img-top: small-sd-card-img-top
:class-body: small-sd-card
:class: small-sd-card
:img-lazy-load: true
+++
<a href="./software-tools-optimization/kernel-analysis-deep/README.html" class="small-card-header-link">
    <h2 class="card-header">Optimizing DeepseekV3 Inference on SGLang Using ROCm Profiling Tools</h2>
</a>
<p class="paragraph">Dive into kernel-level profiling of DeepseekV3 on SGLang—identify GPU bottlenecks and boost large language model performance using ROCm</p>
<div class="date">May 01, 2025 by <a href="https://rocm.blogs.amd.com/authors/liz-li.html">Liz Li</a>, <a href="https://rocm.blogs.amd.com/authors/shekhar-pandey.html">Shekhar Pandey</a>, <a href="https://rocm.blogs.amd.com/authors/seungrok-jung.html">Seungrok Jung</a>, <a href="https://rocm.blogs.amd.com/authors/andy-luo.html">Andy Luo</a></div>
:::

::::

<h2> Stay informed</h2>
<ul>
    <li><a href="blog/atom.xml"> Subscribe to our <i class="fa fa-rss fa-rotate-270"></i> RSS feed</a> (Requires an RSS reader available as browser plugins.) </li>
    <li><a href="https://www.amd.com/en/forms/sign-up/developer-news.html?temp_comments=ROCm%20Software"> Signup for the ROCm newsletter </a></li>
    <li><a href="blog_statistics.html"> View our blog statistics </a></li>
    <li><a href="https://www.amd.com/en/developer/resources/rocm-hub.html"> View the ROCm Developer Hub </a></li>
    <li><a href="https://github.com/ROCm/rocm-blogs/issues"> Report an issue or request a feature</a></li>
    <li>We are eager to learn from our community! If you would like to contribute to the ROCm Blogs, please submit your technical blog for review at our GitHub. Blog creation can be started through our GitHub <a href="https://github.com/ROCm/rocm-blogs/issues/new?template=blog-create.yml"> issues form.</a></li>
</ul>

