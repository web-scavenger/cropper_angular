cropperApp.directive('cropper', function cropperFactory(cropperFactory){
  
    return {
        restrict: 'E',
        templateUrl: '../app/js/cropper.tpl.html',
        transclude: true,
        scope: {
            ghMode: '@'
        },
        controller: function($scope, $element){
            $scope.sendRequest = function(){
                // cropperFactory.getResponders();         
            }
            
           

            $scope.backToChange = function(){
                cropperFactory.backToChangeFoo(cropperFactory.previewBlock);
            }
        
            $scope.cutImage = function(){  
                let downlBtn = $element[0].querySelector('.download__btn');
                let mode = $scope.ghMode;
               
                cropperFactory.cutImage(cropperFactory.canvasPreview, cropperFactory.canvasImgPath, cropperFactory.imageName, cropperFactory.previewBlock, downlBtn, mode);
                
            }
        },
        link: function (scope, element, attrs) {
            // let croper = new cropperFactory();
            console.log(cropperFactory)
            let canvas = element[0].querySelector('.canvas');
            let canvasPreview = element[0].querySelector('.canvas__preview');
            let addNewImgBtn = element[0].querySelector('.add__new--img');
            let previewBlock = element[0].querySelector('.preview__block');          
            
            cropperFactory.init(canvas, canvasPreview, addNewImgBtn, previewBlock);    
        }
    }
});