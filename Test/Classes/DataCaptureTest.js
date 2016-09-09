/**
 * Created by Bright on 06/08/2016.
 */
(function(window, DataClass){
    'use strict';
    //HTML - For test purposes
    var html =   '<div id="testBox" class="container"><div class="row">'+
        '<div class="col-md-6">'+
        '<form>'+
        '<h1>Create your Ve Account</h1>'+
        '<hr>'+
        '<div class="form-group">'+
        '<label for="email">Email address</label>'+
        '<input type="email" class="form-control" id="email" placeholder="Enter email"></div>'+
        '<div class="form-group">'+
        '<label for="password">Password</label>'+
        '<input type="password" class="form-control" id="password" placeholder="Enter password"></div>'+
        '<hr>'+
        '<div class="form-group">'+
        '<label for="firstName">First name</label>'+
        '<input type="text" class="form-control" id="firstName" placeholder="Enter first name"></div>'+
        '<div class="form-group">'+
        '<label for="lastName">Last name</label>'+
        '<input type="text" class="form-control" id="lastName" placeholder="Enter last name"></div>'+
        '<div class="radio-inline"><label>input type="radio" name="sex" id="male" value="male">Male</label></div>'+
        '<div class="radio-inline"><label><input type="radio" name="sex" id="female" value="female">Female</label></div>'+
        '<br><br>'+
        '<div class="form-group"><label for="phoneNumber">Phone number</label><input type="number" class="form-control" id="phoneNumber" placeholder="Enter UK phone number"></div>'+
        '<div class="checkbox"><label><input type="checkbox" id="termsAndConditions">I Agree To The Terms & Conditions</label></div>'+'</form>'+
        '</div>'+
        '<div class="col-md-6">'+
        '<h1>My cart</h1>'+
        '<hr>'+
        '<table class="table">'+
        '<thead><tr><th>Product name</th><th>Quantity</th><th>Price</th></tr></thead>'+
        '<tbody><tr><td class="productName">Ve Lamp</td><td class="productQuantity">2</td><td class="productPrice">£20</td></tr>'+
        '</tbody>'+
        '<tfoot><tr><td></td><td>Sum</td><td id="totalPrice">£40</td></tr></tfoot>'+
        '</table>'+
        '</div>'+
        '</div>'+
        '</div>';

    //Mappings for test purposes
    var mappings = [
        {
            id: 1,
            selector: '#email',
            attribute: 'value',
            event: 'onChange',
            isEmail: true,
            isPhoneNumber: false
        },
        {
            id: 2,
            selector: '#firstName',
            attribute: 'value',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 3,
            selector: '#lastName',
            attribute: 'value',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 4,
            selector: 'input[name="sex"]',
            attribute: 'radio',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 5,
            selector: '#phoneNumber',
            attribute: 'value',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: true
        },
        {
            id: 6,
            selector: '#termsAndConditions',
            attribute: 'checkbox',
            event: 'onChange',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 7,
            selector: '.productName',
            attribute: 'text',
            event: 'onLoad',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 8,
            selector: '.productQuantity',
            attribute: 'text',
            event: 'onLoad',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 9,
            selector: '.productPrice',
            attribute: 'text',
            event: 'onLoad',
            isEmail: false,
            isPhoneNumber: false
        },
        {
            id: 10,
            selector: '#totalPrice',
            attribute: 'text',
            event: 'onLoad',
            isEmail: false,
            isPhoneNumber: false
        }
    ];
    fdescribe('DataCapture', function(){
        var dataCapture = DataClass.DataCapture,
            dataCaptureObj;
        beforeEach(function(done){
            document.body.insertAdjacentHTML('afterbegin',html); //Insert the HTML so we can interact with it in the test
            dataCaptureObj = new dataCapture(mappings,new classes.DataReporter());
            done();
        });

        afterEach(function(done){
            //remove the inserted HTML
            document.body.removeChild(document.getElementById('testBox'));
            done();
        });

        describe('Constructor', function(){
            it('should have an instance reporter class', function(done){
                expect(dataCaptureObj.reporter).toEqual(jasmine.any(Object));
                done();
            });

            it('should have an instance of mapping class', function(done){
                expect(dataCaptureObj.mappings).toEqual(jasmine.any(Object));
                done();
            });
        });

        describe('initialisation', function(){
            it('should be able to get DOM references using a selector', function(done){
                var selector = '#firstName';
                expect(dataCaptureObj.getDOMElementReference(selector).id).toEqual('firstName');
                done();
            });

            it('should be able to add data attributes to DOM elements', function(done){
                var el = document.querySelector('#firstName');
                dataCaptureObj.attachListenersToElementRef(el,mappings[0]);
                expect(parseInt(el.dataset.idNumber)).toEqual(mappings[0].id);
                done();
            });
        });
        it('should be able to validate email', function(done){
            expect(dataCaptureObj.validateEmail('bridark17@hotmail.com')).toEqual(true);
            done();
        });

        it('should be able to validate phone number', function(done){
            expect(dataCaptureObj.validatePhoneNumber('07502374958')).toEqual(true);
            done();
        });

        it('should be able to flatten a multidimensional array', function(done){
            expect(dataCaptureObj.flattenArray([[1,2],[3,4]])).toEqual([1,2,3,4]);
            done();
        });

        it('should be able to get all values for all static elements', function(done){
            expect(dataCaptureObj.getDataFromStaticElements([{dataset:{idNumber:1}}])).toEqual(jasmine.any(Array));
            expect(dataCaptureObj.getDataFromStaticElements([{dataset:{idNumber:1}}]).length).toEqual(1);
            done();
        });

        it('should have an object with id and data', function(done){
            expect(dataCaptureObj.getDataFromDynamicElements({value :'bright'},[{attribute:'value'}])).toEqual(jasmine.any(Array));
            expect(dataCaptureObj.getDataFromDynamicElements({value :'bright'},[{attribute:'value'}]).length).toEqual(1);
            done();
        });

    });
})(window,DataClass);