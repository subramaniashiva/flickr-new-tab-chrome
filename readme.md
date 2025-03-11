#Flickr new tab extension for chrome#

This extension brings life to the new tab page in chrome. Whenever a new tab is opened in chrome, this extension loads an image from the flickr public stream. You can choose the type of images that you want to see using tags in the extension. 

Flickr already has an official extension in chrome store. But you cannot choose the type of images in that extension. It displays random photos every time you open the new tab. So I wanted to improve on that by displaying images according to user's wish.

I feel this extension is faster than other similiar plugins because of two reasons.

* I query Flickr API whenever a tag is changed and store those details in localStorage. So there is no frequent request to Flickr API.
* Whenever a new tab is opened, I build the next image's URL from the localStorage data. And I set this URL to the image element created dynamically. But this image element will not be aded to DOM. This will initiate a HTTP request and get the image. So the next time new tab is opened, this image is taken from the cache by chrome and loads it faster.

I will write a detailed blog post about this plugin. I did this as my free time project. So if you want to fix bug/add new feature please open an issue and send me a pull request.

###Future improvements###
* Ability to go back to chrome default new tab page
* Display the image occupying the entire viewport. Currently it displays the image centered in viewport. A logic for selecting images that fit into user's viewport should be written. Should include the varying screen sizes for the same users (for ex: connecting to the desktop monitor)
* When the user returns back to the tags used already, it should not show the images already shown

###Special thanks to the following friends:###
* [Vikas Lalwani](https://github.com/lalwanivikas) for giving this idea and patiently testing this extension
* [Premnath](https://www.flickr.com/photos/premnath/) for providing default photos for this extension
* [Raghunath](https://www.flickr.com/photos/104818937@N06) for providing default photos for this extension
