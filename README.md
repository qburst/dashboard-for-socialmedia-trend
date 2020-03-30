# Social Data Analysis Platform
Currently crunching twitter data and transforming that to several categories and using a web platform to show the data to the world. 

# Finding Solutions to Fight Corona Problems:

* Too much data coming in twitter stream
* Categorizing the data:
    * Corona Positive Tweets(Recovery cases, New Policy to avoid Corona, Trials Success) vs Negative Tweets(New Corona Case Reported, More patients dead, Spread to new area)
    * Corona Supply Request(We need to identify supply shortages in area)
    * Corona Notice(Major announcements)
* Country based categorisation:

    * Will have further drilled down with following:
        * Death
        * Recovery
        * New Case
        * Reoccurrence


## Implementation Plan:

* Build PySpark Streaming app using NLTK for categorizing tweets
* Saving data on to Mongo Database
Visualization of the Data on DB using a web platform
* Implement a user login based platform where users could request for additional twitter tags from which we need to pull data.
* Generate statistics based on the above data.
* Will visualize statistics in the later phase into a dashboard like this

# Web Platform Technologies considered:
* Django/Flask
* Angular based frontend and backend using DRF

## Block Diagram

![Block Diagram](backend/api/static/images/blockdiagram.jpg)
