{\rtf1\ansi\ansicpg936\cocoartf1404\cocoasubrtf460
{\fonttbl\f0\fmodern\fcharset0 Courier;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sl280\partightenfactor0

\f0\fs24 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 var i=0;\
\
function timedCount()\
\{\
i=i+1;\
postMessage(i);\
setTimeout("timedCount()",500);\
\}\
\
timedCount();\
}