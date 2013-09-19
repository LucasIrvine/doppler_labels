dopplerLabels = {

  init: function(lbData){
    self = this;
    self.json = lbData;
    self.width = 960;
    self.height = 800;
    self.labelWidth = 185;
    self.labelHeight = 28;
    //self.colors = ['#61c6d9', '#61d99c', '#a8d54c', '#adaf30', '#c49846', '#c46e46', '#c4464c', '#bf4280', '#bb46c4', '#976dff', '#6d85ff', '#81c2ff', '#83ba99', '#a0ad90', '#ad9090' /*, '#9b90ad', '#88a4b5', '#0ca48a', '#bdbdbd', '#545454'*/];
    self.colors = ['#61c6d9','#a8d54c','#c49846','#bf4280', '#976dff','#6d85ff','#a0ad90','#9b90ad','#88a4b5','#0ca48a'];
    
    //just for development to change all the x values quickly
    self.xVal = function(n){
      self.startVal = -58;
      self.valueArr = [];
      for(var r=0; r<10; r++){
        self.startVal += 25;
        self.valueArr.push(self.startVal);
      }
      return self.valueArr[n];
    };

    //again just for development to change all the x values quickly
    self.y1 = 33;
    self.y2 = 58;
    self.colorPicker = [
      {'color': self.colors[0],'x':self.xVal(0),'y':self.y1},
      {'color': self.colors[1],'x':self.xVal(1),'y':self.y1},
      {'color': self.colors[2],'x':self.xVal(2),'y':self.y1},
      {'color': self.colors[3],'x':self.xVal(3),'y':self.y1},
      {'color': self.colors[4],'x':self.xVal(4),'y':self.y1},
      {'color': self.colors[5],'x':self.xVal(0),'y':self.y2},
      {'color': self.colors[6],'x':self.xVal(1),'y':self.y2},
      {'color': self.colors[7],'x':self.xVal(2),'y':self.y2},
      {'color': self.colors[8],'x':self.xVal(3),'y':self.y2},
      {'color': self.colors[9],'x':self.xVal(4),'y':self.y2},
    ];

    self.labelConfig = [
      {
        'name':'edit',
        'x':-55,
        'click':function(optionsObj){
         self.editClick(optionsObj);
        }
      },
      {
        'name':'color',
        'x':-18,
        'click':function(optionsObj){
         self.colorClick(optionsObj);
        }
      },
      {
        'name':'arrow',
        'x':18,
        'click':function(optionsObj){
         self.arrowClick(optionsObj);
        }
      },
      {
        'name':'delete',
        'x':55,
        'click':function(optionsObj){
         self.deleteClick(optionsObj);
        }
      }
    ];

    self.createSvg(self);
  },

  createSvg: function(self){
    self.svg = d3.select('.labelWrap')
      .append('svg')
      .attr({
        'width':self.width,
        'height':self.height
      });

      self.grabJson(self);
  },

  grabJson: function(self){
    d3.json(self.json, function(labelData){
      self.labelData = labelData;
      self.drawLabelGroup(self.labelData);
    });
  },

  drawLabelGroup: function(data){
    self.labelGroup = self.svg.selectAll('.labelsGroups')
      .data(data.labels)
      .enter()
      .append('svg:g')
        .attr('class', 'labelsGroups');
        
    self.drawLabels(self.labelData);
  },

  drawLabels: function(data){
    self.labelGroup
      .insert('svg:text')
        .text(function(d,i){return d.name;})
        .attr({
          'class':'hiddenText',
          'width':function(d,i){ d.length = this.getComputedTextLength() + 10; return d.length;},
        })
        .style('opacity', '0');

    self.labelGroup
        .insert('svg:rect')
        .attr({
          'id':function(d,i){return d.id;},
          'data-index' : function(d,i){return i;},
          'class':'labelRect',
          'width':function(d,i){return d.length;},
          'height':self.labelHeight,
          'x':function(d,i){return d.x;},
          'y':function(d,i){return d.y;},
          'rx':6,
          'ry':6
        })
        .style({
          'fill':function(d,i){
            return d.color;
          },
          'stroke' : '#999',
          'stroke-width':1
        });

    self.labelGroup
      .insert('svg:text')
        .text(function(d,i){return d.name;})
        .attr({
          'class':'labelText',
          'x':function(d,i){return d.x + 5;},
          'y':function(d,i){return d.y + 20;}
        })
        .style('fill', '#000');

    self.labelClick();
  },

  labelClick: function(){

      self.labelGroup.selectAll('.labelRect')
       .on('click', function(){
        clickedIndex = d3.select(this).attr('data-index');
        self.showOptions(this, clickedIndex);
      });

     
  },
  
  updateLabels: function(data, optionsObj){
    self.labelGroup.selectAll('.optionsOpen')
      .data(data.labels)
      .transition()
        .style({
          'fill':function(d,i){
            //rectColor = self.colors[Math.floor(Math.random() * self.colors.length)];
            return data.labels[optionsObj.indexer].color;
          }
        });
  },

  clickCheck: function(){

  },

  showOptions: function(item, clickedIndex){

    var optionsObj = {
      'item' : item,
      'indexer' : clickedIndex,
      'classCheck' : d3.select(item).attr('class'),
      'centerPointX' : item.x.baseVal.value + (item.width.baseVal.value / 2),
      'centerPointY' : item.y.baseVal.value + (item.height.baseVal.value / 2)
    };

    if(optionsObj.classCheck != 'labelRect optionsOpen'){
      self.removeOptions();
      d3.selectAll('.labelRect').attr('class', 'labelRect');
      d3.select(item).attr('class', 'labelRect optionsOpen');
     
      self.showOptText(optionsObj);
      self.showOptIcons(optionsObj);
      self.showOptBubbles(optionsObj);
     
    } else {
      self.removeOptions();
      
      //remove optionsOpen class
      d3.select(item).attr('class', 'labelRect');
    }
  },

 showOptText: function(optionsObj){

    self.optionGroup = self.svg.append('svg:g')
      .attr('class', 'optionGroup');

    self.optionGroup.selectAll('.optionText')
      .data(self.labelConfig)
      .enter()
        .append('svg:text')
        .attr({
          'class':'optionText',
          'x':optionsObj.centerPointX,
          'y':optionsObj.centerPointY,
          "text-anchor":"middle"
        })
        .style({'opacity':'0','fill':d3.rgb('#333'),'font-size':'10px'
        })
        .transition()
        .attr({
          'x':function(d,i){return optionsObj.centerPointX + d.x;},
          'y':function(d,i){return optionsObj.centerPointY - 28;}
        })
        .style({'opacity':'1','font-size':'10px'})
        .text(function(d,i){return d.name;});
  },

  showOptIcons: function(optionsObj){
    self.optionGroup.selectAll('.optionIcon')
      .data(self.labelConfig)
      .enter()
        .append('svg:image')
        .attr({
          'xlink:href':function(d,i){return 'img/' + d.name + '.png';},
          'class':'optionIcon',
          'x':optionsObj.centerPointX,
          'y':optionsObj.centerPointY,
          'width':0,
          'height':0
        })
        .style({'opacity':'0'})
        .transition()
        .attr({
          'x':function(d,i){return optionsObj.centerPointX + d.x - 10;},
          'y':function(d,i){return optionsObj.centerPointY - 65;},
          'width':20,
          'height':20
        })
        .style({'opacity':'1'});
  },

  showOptBubbles: function(optionsObj){
    self.optionGroup.selectAll('.labelOptCirc')
      .data(self.labelConfig)
      .enter()
        .append('svg:circle')
        .attr({
          'class':'labelOptCirc',
          'r':1,
          'cx':optionsObj.centerPointX,
          'cy':optionsObj.centerPointY
        })
        .style({'opacity':'0','fill':d3.rgb('#666')})
        .on('mouseover', function(d,i){
          d3.select(this).style({'stroke':d3.rgb('#666').darker(2), 'opacity':0.4});
        })
         .on('mouseout', function(d,i){
          d3.select(this).style({'stroke':'none', 'opacity':0.6});
        })
        .on('click', function(d,i){
          d.click(optionsObj);
        })
        .transition()
        .attr({
          'r':15,
          'cx':function(d,i){
            if(i === 1){
              optionsObj.colorBubbleX = optionsObj.centerPointX + d.x;
            }
            return optionsObj.centerPointX + d.x;
          },
          'cy':function(d,i){
            if(i === 1){
              optionsObj.colorBubbleY = optionsObj.centerPointY - 55;
            }
            return optionsObj.centerPointY - 55;
          }
        })
        .style({'opacity':'0.6'});
  },

  removeOptions: function(){
    self.svg.selectAll('.optionGroup')
      .transition()
        .style({'opacity':'0'})
        .remove();
  },
/*
  removeOptIcons: function(){
    self.svg.selectAll('.optionIcon')
      .transition()
        .attr({
          'width':0,
          'height':0
        })
        .style({'opacity':'0'})
        .remove();
  },

  removeOptBubbles: function(selectors){
    self.svg.selectAll(selectors)
      .transition()
        .attr({
          'r':1,
        })
        .style({'opacity':'0'})
        .remove();
  },
*/  

  editClick: function(optionsObj){
    console.log('you clicked edit you turkey');
    console.log(optionsObj);
  },

  colorClick: function(optionsObj){
    self.optionGroup.selectAll('.colorPick')
      .data(self.colorPicker)
      .enter()
        .append('svg:circle')
        .attr({
          'class':'colorPick',
          'r':1,
          'cx':optionsObj.colorBubbleX,
          'cy':optionsObj.colorBubbleY
        })
        .style({
          'opacity':'0',
          'fill': function(d,i){
            return d3.rgb(d.color);
          }
        })
        .on('mouseover', function(d,i){
          d3.select(this).style({'stroke':d3.rgb(d.color).darker(0.5),'opacity':1});
        })
         .on('mouseout', function(d,i){
          d3.select(this).style({'stroke':'none'});
        })
        .on('click', function(d,i){
          //change the data
          self.labelData.labels[optionsObj.indexer].color = d.color;
          //update visually
          self.updateLabels(self.labelData, optionsObj);
        })
        .transition()
        .attr({
          'r':10,
          'cx':function(d,i){return optionsObj.colorBubbleX + d.x;},
          'cy':function(d,i){return optionsObj.colorBubbleY - d.y;}
        })
        .style({'opacity':'0.9'});
  },

  arrowClick: function(optionsObj){
    console.log('you clicked arrow you turkey');
    console.log(optionsObj);
  },

  deleteClick: function(optionsObj){
    console.log('you clicked delete you turkey');
    console.log(optionsObj);
  }

};

dopplerLabels.init('data/labels.json');