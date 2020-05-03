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
To define diffent speaker in same line, please use`,`,`&`or`、`(`\u3001`).

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
### How to use for Youtube CC
##### Step1
Download subtitle file with sbv file format on Youtube.
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/step1.png)
##### Step2
Upload subtitle file and add Speaker Colour Setting. Then click `downlload`.
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/step2.png)
##### Step3
Click `upload file` on YouTube.
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/step3.png)
##### Step4
Upload the `.xml` file.
![](https://martin605.github.io/Subtitle-Speaker-Colour-Convertor/img/step4.png)
