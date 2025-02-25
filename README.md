# Benchmarking
Mediam Server Benchmarking for feasibility analysis

## Software Versions Used: 

1. Mediamtx: v1.11.3 (Latest Release as of 19/02/2025)

2. Mediamtx Docker Image: bluenviron/mediamtx:1.11.3

## Benchmarking Tool used

1. SAR for Ubuntu CPU Memeory metrics
2. iostat for Ubuntu Disk IO metrics

### Mediamtx Benchmark Live Stream

1. On Host

- 100 Live Streams
11:06:59 AM IST     CPU     %user     %nice   %system   %iowait    %steal     %idle
Average:        all      2.62      0.00      1.13      0.00      0.00     96.25


11:07:15 AM IST kbmemfree   kbavail kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact   kbdirty
Average:      8269424  11915677   3007389     18.67    109104   4268607  18564246    101.98   4368126   2028918       110

- 200 Live Streams
11:53:11 AM IST     CPU     %user     %nice   %system   %iowait    %steal     %idle
Average:        all      4.84      0.00      2.17      0.01      0.00     92.98

11:52:56 AM IST kbmemfree   kbavail kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact   kbdirty
Average:      7914092  11593632   3234387     20.08    114350   4384168  19354784    106.33   4624120   2042454       143

- 400 Live Streams
12:31:12 PM IST     CPU     %user     %nice   %system   %iowait    %steal     %idle
Average:        all      6.02      0.00      2.72      0.03      0.00     91.22

12:31:24 PM IST kbmemfree   kbavail kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact   kbdirty
Average:      6959926  10663559   4189749     26.01    117670   4374712  20173240    110.82   5571606   2057908       129

1. On Docker Container

- 100 streams

12:49:03 PM IST     CPU     %user     %nice   %system   %iowait    %steal     %idle
Average:        all      3.75      0.00      2.05      0.01      0.00     94.19

12:48:49 PM IST kbmemfree   kbavail kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact   kbdirty
Average:      7927531  11680542   3138671     19.49    121232   4442880  20441872    112.30   4516597   2095715       124

- 500 streams

03:53:45 PM IST     CPU     %user     %nice   %system   %iowait    %steal     %idle
03:53:46 PM IST     all      4.88      0.00      2.96      0.00      0.00     92.16

03:54:00 PM IST kbmemfree   kbavail kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact   kbdirty
03:54:01 PM IST   6231060  10230944   4679444     29.05    137952   4562220  17293008     95.00   6055204   2311372        64
