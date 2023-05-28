#!/bin/bash

item_template='<li><a href="#F#">#F#</a></li>'
list=''

filename='[0-9]+\.[0-9]+\.[0-9]+'

# This loop will bring issues when we hit v10
for f in *
do
    if [[ -d "$f" ]] && [[ "$f" =~ $filename ]]
    then
        list+="${item_template//'#F#'/"$f"}"
    fi
done

ESCAPED_REPLACE=$(printf '%s\n' "$list" | sed -e 's/[\/&]/\\&/g')
sed "s/#BODY#/$ESCAPED_REPLACE/g" template.html > index.html
