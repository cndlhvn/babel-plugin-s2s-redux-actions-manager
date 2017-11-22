import fs from 'fs'
import globby from 'globby'
import createFile from 'babel-file';
import generate from '@babel/generator';

module.exports = babel => {
  var t = babel.types;
  let variableDeclarators = []

  return {
    name: "s2s-redux-actions-manager",
    visitor: {
      VariableDeclarator(path,state){
        variableDeclarators.push(path.node.id.name)
      },
      Program: {
        enter(path, state) {
          const { input, output } = state.opts

          if (!input) {
            throw new Error('require input option')
          }

          if (!output) {
            throw new Error('require output option')
          }

          const inputFiles = globby.sync(input)
          const outputFiles = globby.sync(output)

          const outputDirPath = output.split("/").reverse().slice(1).reverse().join("/")

          const inputFilesName = inputFiles.map(f =>  f.split("/").pop())
          const outputFilesName = outputFiles.map(f => f.split("/").pop())

          // If there is no input directory file in the output directory, create a file
          inputFilesName.map(
            f => {
              if (outputFilesName.indexOf(f) == -1){
                fs.writeFileSync( outputDirPath+"/" + f, "")
              }
            }
          )
        },

        exit(path, state){
          const { output } = state.opts

          const inputFilePath = state.file.opts.filename
          const inputFileName = inputFilePath.split("/").pop()

          const outputDirPath = output.split("/").reverse().slice(1).reverse().join("/")
          const outputFilePath = outputDirPath + "/" + inputFileName

          let outputFile
          let actionNameArray = []

          fs.readFile(outputFilePath, (err, data) => {
            const outputFileSrc = data.toString();
            outputFile = createFile(outputFileSrc, {
              filename: outputFilePath
            })

            outputFile.path.traverse({
              VariableDeclarator(path){
                actionNameArray.push(path.node.id.name)
              }
            })

            variableDeclarators.forEach((val,index,ar) => {
              if (actionNameArray.indexOf(val) == -1){
                outputFile.path.node.body.push(t.ExpressionStatement(t.Identifier(val)))
                const resultSrc = generate(outputFile.ast).code;
                fs.writeFile(outputFilePath, resultSrc, (err) => { if(err) {throw err} });
              }
            });

            if(actionNameArray.length > variableDeclarators.length){
              actionNameArray.forEach((val,index,ar) => {
                if (variableDeclarators.indexOf(val) == -1){
                  outputFile.path.traverse({
                    VariableDeclarator(path){
                      if(path.node.id.name == val){
                        path.remove()
                      }
                    }
                  })
                }
              })
              const resultSrc = generate(outputFile.ast).code
              fs.writeFile(outputFilePath, resultSrc, (err) => { if (err) { throw err} })
            }

            actionNameArray = []
            variableDeclarators = []
          })
        }
      }
    }
  }
}
