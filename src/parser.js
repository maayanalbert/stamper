import esprima from "esprima"


  export default function jsToStamps(rawCode){

    var snippets = getSnippets(rawCode)

    var stamps = []
    for(var i = 0; i < snippets.length; i++){
      var item = snippets[i][0]
      var addFn = snippets[i][1]
      addFn(stamps, item, rawCode)
    }

    var sortedStamps = {vars:[], fns:[], comments:[], other:[]}
    stamps.map(stamp =>{
      sortedStamps[stamp.category].push(stamp.data)
    })

    return sortedStamps
  }

  function addVar(stamps, item, rawCode){
    var range = item.range
    var category = "vars"
    var code = rawCode.substr(item.range[0], item.range[1] + 1)

    if(stamps.length === 0 || stamps[stamps.length-1].category != "var"){
      stamps.push({category:category, data:{code:code}})
    }else{
      var stamp = stamps[stamps.length-1]
      stamp.range[1] = range[1]
      stamp.data.code += "\n" + code
    }
  }

  function addOther(stamps, item, rawCode){
    var range = item.range
    var category = "other"
    var code = rawCode.substr(item.range[0], item.range[1] + 1)

    if(stamps.length === 0 || stamps[stamps.length-1].category != "code"){
      stamps.push({category:category, data:{code:code}})
    }else{
     var stamp = stamps[stamps.length-1]
      stamp.range[1] = range[1]
      stamp.data.code += "\n" + code
    }
  }

  function addComment(stamps, item, rawCode){
    var range = item.range
    var category = "comments"
    var innerCode = rawCode.substr(item.range[0], item.range[1] + 1)
    if(item.type === "Line"){
      var code = "// " + innerCode
    }else{
      var code = "/*\n" + innerCode + "\n*/"
    }

    stamps.push({category:category, data:{code:code}})
  }

  function addFn(stamps, item, rawCode){
    var range = item.range
    var category = "fns"
    var name = item.id.name

    var args = ""
    if(item.params.length > 1){
      var argStart = item.params[0].range[0]
      var argEnd = item.params[item.params.length - 1].range[1]
      var args = rawCode.substr[argStart, argEnd + 1]
    }

    var code = rawCode.substr(item.body.range[0], item.body.range[1])
    stamps.push({category:category, data:{code:code, name:name, args:args}})
  }

  function getSnippets(rawCode){
    var program = esprima.parseScript(rawCode, {range:true, comment:true, tolerant:true})
    var snippets = []
    var otherExpressions = {}

    // get everything that isn't a comment
    for(var i = 0; i< program.body.length; i+= 1){
      var item = program.body[i]
      if(item.type === "FunctionDeclaration"){
        snippets.push( (item, addFn) )
      }else if(item.type in otherExpressions ){
        snippets.push( (item, addOther) )
      }else {
        snippets.push( (item, addVar) )
      }
    }

    // get comments
    program.comments.map(item => {
      var pos = getPos(snippets, item.range)
      if(pos > 0){
        snippets.splice(pos, 0, (item, addComment))
      }
      
    })    
  }

  function getPos(snippets, range){
    for(var i = 0; i < snippets.length; i++){
      var snippet = snippets[i]
      if(snippet[0].range[0] < range[0] && range[1]< snippet[0].range[1]){
        return -1
      }
      if(range[0] < snippet[0].range[0]){
        return i
      }
    }
  }
