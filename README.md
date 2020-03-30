[Link to Convertor](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/  "Link to Convertor")
# Subtitle Speaker Colour Convertor

## Features
- Adding colour for subtitle pre speaker

## Sample

![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/sample1.png)
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/sample2.png)
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/sample3.png)

## User Guide
### File Requirement

#### Original Subtitle File

The file format should be `.sbv`.
To define speaker, please use`:`or`：`(`\uff1a`).
To define diffent speaker in same line, please use`&`.

subtitle.sbv
```
0:00:00.000,0:00:02.000
Martin:我係Martin

0:00:02.000,0:00:02.500
Jacky:我係Jacky
Monty:我係Monty
Hang:我係Hang

0:00:02.500,0:00:04.000
Martin&Hang&Jacky:字幕上顏色

0:00:04.000,0:00:06.000
Monty&Hang:Subtitle
```
#### Speaker Colour Setting File
The file format should be `.json`.
You can generate this file from convertor and download it.

colour.json
```
{
	"Martin":"FFFFFF",
	"Jacky":"FFFFFF","
	Monty":"FFFFFF",
	"Hang":"FFFFFF"
}
```
### How to use
##### Step1
Click `Browse` under *Subtitle File* and select `.sbv` file.
##### Step2
If you don't have speaker colour setting json file, you can create a new one on Speaker Colour Setting. You can move to step2A. 
If you have speaker colour setting json file, you can upload your file to Speaker Colour Setting. You can move to step2B. 
###### Step2A
To add a new speaker, please click `+` button which is at the end of session *Speaker Colour Setting*.
Please type the name of Speaker which same to the original subtitle file and the format of colour is HEX e.g.`#FFFFFF`(but don't need to type`#`).
If you want to download the file of speaker colour setting, click  `save` button next to *load* button.
###### Step2B
Click `Browse` under *Speaker Colour Setting* and select `.json` file.
If success, the speaker colour setting will auto show. If you cannot see the speaker colour setting, try click `load` button next to *Browse* button. If still cannot show the speaker colour setting, there have on your file and try to make a new one. 
If you want to download the file of speaker colour setting, click  `save` button next to *load* button.
##### Step3
Click `Convert` at the end of the page. The `.ytt` file will download.

###How to use for Youtube CC
##### Step1
Download subtitle file with sbv file format on Youtube.
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/step1.png)
##### Step2
Upload subtitle file and add Speaker Colour Setting. Then click `convert`.
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/step2.png)
##### Step3
Click `upload file` on YouTube.
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/step3.png)
##### Step4
Upload the `.ytt` file.
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/step4.png)
