var Q = require('Q');
var multer = require('multer');
var imagePath = "./public";
var upload = function (req, res) {
  var deferred = Q.defer();
  var storage = multer.diskStorage({
    // 서버에 저장할 폴더
    destination: function (req, file, cb) {
      cb(null, imagePath);
    },

    // 서버에 저장할 파일 명
    filename: function (req, file, cb) {
      file.uploadedFile = {
        name: req.params.filename,
        ext: file.mimetype.split('/')[1]
      };
      cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
    }
  });

  var upload = multer({ storage: storage }).single('file');
  upload(req, res, function (err) {
    if (err) deferred.reject();
    else deferred.resolve(req.file.uploadedFile);
  });
  return deferred.promise;
};
router.get('/', (req,res)=>{
  res.send('이미지 쑤시기!');
});
router.post('/:filename', function(req, res, next) {
  upload(req, res).then(function (file) {
      res.json(file);
    }, function (err) {
      res.send(500, err);
    });
});

module.exports = router;
