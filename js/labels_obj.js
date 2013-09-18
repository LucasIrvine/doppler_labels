dopplerLabels = {

  init: function(lbData){
      self = this;
      self.json = lbData;
      self.width = 960;
      self.height = 800;
      self.labelWidth = 185;
      self.labelHeight = 28;
      self.colors = ['#61c6d9', '#61d99c', '#a8d54c', '#adaf30', '#c49846', '#c46e46', '#c4464c', '#bf4280', '#bb46c4', '#976dff', '#6d85ff', '#81c2ff', '#83ba99', '#a0ad90', '#ad9090' /*, '#9b90ad', '#88a4b5', '#0ca48a', '#bdbdbd', '#545454'*/];
   
      self.labelConfig = [
        {
          'name':'edit',
          'x':-55,
          'click':function(){
           console.log('you clicked edit you turkey!!');
          }
        },
        {
          'name':'color',
          'x':-18,
          'click':function(){
           console.log('you clicked color you turkey!!');
          }
        },
        {
          'name':'arrow',
          'x':18,
          'click':function(){
           console.log('you clicked arrow you turkey!!');
          }
        },
        {
          'name':'delete',
          'x':55,
          'click':function(){
           console.log('you clicked delete you turkey!!');
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
      self.drawLabels(labelData);
    });
  },

  drawLabels: function(labelData){
    self.svg.selectAll('text')
      .data(labelData.labels)
      .enter()
        .append('svg:text')
        .text(function(d,i){return d.name;})
        .attr({
          'class':'labelText',
          'x':function(d,i){len = this.getComputedTextLength(); return d.x + 5;},
          'y':function(d,i){return d.y + 20;}
        })
        .style('fill', '#000');

    self.svg.selectAll('rect')
      .data(labelData.labels)
      .enter()
        .append('svg:rect')
        .attr({
          'class':'labelRect',
          'width':len + 10,
          'height':self.labelHeight,
          'x':function(d,i){return d.x;},
          'y':function(d,i){return d.y;},
          'rx':6,
          'ry':6
        })
        .style({
          'fill':function(d,i){
            rectColor = self.colors[Math.floor(Math.random() * self.colors.length)];
            return rectColor;
          },
          'stroke' : '#999',
          'stroke-width':1
        })
        .on('click', function(){
          self.showOptions(this);
          
        });
  },

  showOptions: function(item){
    var optionsObj = {};
    optionsObj.classCheck = d3.select(item).attr('class');
    optionsObj.centerPointX = item.x.baseVal.value + (item.width.baseVal.value / 2);
    optionsObj.centerPointY = item.y.baseVal.value + (item.height.baseVal.value / 2);
    
    if(optionsObj.classCheck != 'labelRect optionsOpen'){
      d3.select(item).attr('class', 'labelRect optionsOpen');
     
      self.showOptText(optionsObj);
      self.showOptIcons(optionsObj);
      self.showOptBubbles(optionsObj);
     
    } else {
      self.removeOptText(optionsObj);
      self.removeOptIcons(optionsObj);
      self.removeOptBubbles(optionsObj);
      
      //remove optionsOpen class
      d3.select(item).attr('class', 'labelRect');
    }
  },

  showOptText: function(optionsObj){
    self.svg.selectAll('.optionText')
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
        /*.delay(function(d,i){
          return i * 10;
        })*/
        .attr({
          'x':function(d,i){return optionsObj.centerPointX + d.x;},
          'y':function(d,i){return optionsObj.centerPointY - 28;}
        })
        .style({'opacity':'1','font-size':'10px'})
        .text(function(d,i){return d.name;});
  },

  showOptIcons: function(optionsObj){
    self.svg.selectAll('.optionIcon')
      .data(self.labelConfig)
      .enter()
        .append('svg:image')
        .attr({
          'xlink:href':function(d,i){return '../img/' + d.name + '.png';},
          'class':'optionIcon',
          'x':optionsObj.centerPointX,
          'y':optionsObj.centerPointY,
          'width':0,
          'height':0
        })
        .style({'opacity':'0'})
        .transition()
        /*.delay(function(d,i){
          return i * 10;
        })*/
        .attr({
          'x':function(d,i){return optionsObj.centerPointX + d.x - 10;},
          'y':function(d,i){return optionsObj.centerPointY - 65;},
          'width':20,
          'height':20
        })
        .style({'opacity':'1'});
  },

  showOptBubbles: function(optionsObj){
    self.svg.selectAll('circle')
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
          d.click();
        })
        .transition()
        /*.delay(function(d,i){
          return i * 10;
        })*/
        .attr({
          'r':15,
          'cx':function(d,i){return optionsObj.centerPointX + d.x;},
          'cy':function(d,i){return optionsObj.centerPointY - 55;}
        })
        .style({'opacity':'0.6'});
  },

  removeOptText: function(optionsObj){
    self.svg.selectAll('.optionText')
      .transition()
        .attr({
          'x':optionsObj.centerPointX,
          'y':optionsObj.centerPointY,
        })
        .style({'opacity':'0','font-size':'1px'})
        .remove();
  },

  removeOptIcons: function(optionsObj){
    self.svg.selectAll('.optionIcon')
      .transition()
        .attr({
         'x':optionsObj.centerPointX,
          'y':optionsObj.centerPointY,
          'width':0,
          'height':0
        })
        .style({'opacity':'0'})
        .remove();
  },

  removeOptBubbles: function(optionsObj){
    self.svg.selectAll('.labelOptCirc')
      .transition()
        .attr({
          'r':1,
          'cx':optionsObj.centerPointX,
          'cy':optionsObj.centerPointY
        })
        .style({'opacity':'0'})
        .remove();
  },

};

dopplerLabels.init('data/labels.json');