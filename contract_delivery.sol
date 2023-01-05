// with event method and id balance

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// working step 4 b.s running without accesscontrol
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Wallmart is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _requestIds;
    Counters.Counter private _customerIds;

    using SafeMath for uint256;

    address wallmartAddress =
        payable(0x90F79bf6EB2c4f870365E785982E1f101E93b906); // wallmart
        // payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db); // vmlondon
    uint256[] public productForSale;

    function supportsInterface() public {}

    constructor() ERC1155("wallmart") {}

    enum RequestStatus {
        Pending,
        Rejected,
        Approved,
        Complete,
        Withdraw
    }

    struct Request {
        address requestBy;
        uint256 tokenID;
        uint256 quantity;
        address deliveryBy;
        RequestStatus status;
        // RequestStatus deliveryStatus;
    }

    struct Product {
        uint256 id;
        string name; //pg
        address payable supplier;
        uint256 productExpiryDate;
        uint256 supplierPrice;
        uint256 quantity;
        uint256 priceForCustomer;
        uint256 balance;
    }
    mapping(uint256 => Request) public wallmartRequest;
    mapping(uint256 => Request) public customerRequest;
    // mapping(uint256 => Request) public deliveryPartner;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Product) public pWallmart;

    function addProductBySupplier(
        uint256 _tokenId, // parleG code=1
        string memory _name,
        uint256 _quantity,
        uint256 _productExpiryDate,
        uint256 _supplierPrice
    ) public returns (uint256) {
        uint256 tokenId = _tokenId;
        if (tokenId == 0) {
            _tokenIds.increment();
            tokenId = _tokenIds.current();
        }

        _mint(_msgSender(), tokenId, _quantity, "");

        Product memory product;
        product.id = tokenId;
        product.name = _name;
        product.productExpiryDate = _productExpiryDate;
        product.supplierPrice = _supplierPrice;
        product.quantity = _quantity;
        product.supplier = payable(_msgSender()); //samsung
        uint256 balance = balanceOf(product.supplier, product.id);
        product.balance = balance;
        products[tokenId] = product;
        return (tokenId);
    }

    // wallmart requesting from seller
    function requestFromWallmart(uint256 _tokenId, uint256 _quantity) public {
        _requestIds.increment();
        uint256 requestId = _requestIds.current();

        Request memory requesting;
        requesting.requestBy = _msgSender();
        requesting.tokenID = _tokenId;
        requesting.quantity = _quantity;
        requesting.status = RequestStatus.Pending;
        wallmartRequest[requestId] = requesting;
    }

    function sellerResponseToRequest(
        uint256 _wallmartRequestID,
        bool _isApproved
    ) public payable {
        Request memory request = wallmartRequest[_wallmartRequestID];
        wallmartRequest[_wallmartRequestID].status = _isApproved
            ? RequestStatus.Approved
            : RequestStatus.Rejected;

        if (_isApproved) {
            if (request.quantity > balanceOf(msg.sender, request.tokenID)) {
                uint256 missingMint = request.quantity -
                    balanceOf(msg.sender, request.tokenID);
                _mint(_msgSender(), request.tokenID, missingMint, "");
            }
            _setApprovalForAll(_msgSender(), request.requestBy, _isApproved);

            wallmartRequest[_wallmartRequestID].status = RequestStatus.Approved;
        } else {
            _setApprovalForAll(_msgSender(), request.requestBy, _isApproved);
        }
    }

        // Purchase By Wallmart
    function purchaseByWallmart(
        uint256 _wallmartRequestID,
        uint256 _sellingPrice
    ) public payable {
        Request memory request = wallmartRequest[_wallmartRequestID];
        require(
            request.status == RequestStatus.Approved,
            "Request status is not APPROVED"
        );
        require(request.requestBy == msg.sender, "Unauthorised");

        Product memory product = products[request.tokenID];
        uint256 productCost = product.supplierPrice * request.quantity;
        products[request.tokenID].priceForCustomer = _sellingPrice;
        console.log("productCost", productCost);
        require(msg.value == productCost, "Please send exact product price");

        // transfering quantity from supplier to wallmart
        safeTransferFrom(
            product.supplier,
            request.requestBy,
            request.tokenID,
            request.quantity,
            ""
        );
        // transfer money from wallmart to supplier
        payable(product.supplier).transfer(productCost);
        request.status = RequestStatus.Complete;
        // request.wallBall = balanceOf(request.requestBy,request.tokenID); //
        wallmartRequest[_wallmartRequestID] = request;
      
        _setApprovalForAll(product.supplier, msg.sender, false);
    }

    function withdrawByWallmart(uint256 _wallmartRequestID) public {
        wallmartRequest[_wallmartRequestID].status = RequestStatus.Withdraw;
    }

    event Item(uint256 currentId, uint256 Ball);

    //     ====       ====        ====
    function getAllProducts() public returns (Product[] memory) {
        uint256 productCount = _tokenIds.current(); //
        Product[] memory tokens = new Product[](productCount);
        console.log("productCountG ->", productCount);
        uint256 currentIndex = 0;
        uint256 currentId;
        for (uint256 i = 0; i < productCount; i++) {
            currentId = i + 1;

            Product storage currentItem = products[currentId];
            console.log("id:", currentId);
            currentItem.balance = balanceOf(msg.sender, currentId);
            console.log("bal:", currentItem.balance);
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
            emit Item(currentId, currentItem.balance);
        }
        return tokens;
    }
    // ===
    function totalMintedItems() public view returns (uint256) {
        uint256 productCount = _tokenIds.current(); //
        console.log("productCountG ->", productCount);
        return productCount;
    }

    // function checkBalance(address _address, uint256 _tokenID)
    //     public
    //     view
    //     returns (uint256)
    // {
    //     uint256 bal = balanceOf(_address, _tokenID);
    //     return bal;
    // }

    //=== supplier will see request raised by wallmart
    function fetchWallmartRequest() public view returns (Product[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (wallmartRequest[i + 1].tokenID > 0) {
                itemCount += 1;
            }
        }
        Product[] memory items = new Product[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (wallmartRequest[i + 1].quantity > 0) {
                uint256 currentId = i + 1;
                Product storage currentItem = products[currentId];
                items[currentIndex] = currentItem;
                //   console.log("itms",currentItem);
                currentIndex += 1;
            }
        }
        return items;
    }

    //====

    //wallmart owned products
    function fetchWallmartProducts() public view returns (Product[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 totalWallmartItems = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (balanceOf(wallmartAddress, i + 1) > 0) {
                totalWallmartItems++;
            }
        }

        Product[] memory items = new Product[](totalWallmartItems);
        uint256 j = 0;
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (balanceOf(wallmartAddress, i + 1) > 0) {
                items[j++] = products[i + 1];
            }
        }
        return items;
    }
//
     // ====     products owned by Customer      ====  START
     function fetchCustomerProducts() public view returns (Product[] memory) {
          uint totalItemCount = _tokenIds.current();
          uint256 totalCustomerItems = 0;

          for (uint256 i = 0; i < totalItemCount; i++) {
            if (balanceOf(msg.sender, i + 1) > 0) {
                totalCustomerItems++;
            }
        }
          Product[] memory items = new Product[](totalCustomerItems);
          uint256 j = 0;
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (balanceOf(msg.sender, i + 1) > 0) {
                items[j++] = products[i + 1];
            }
        }
          return items;
        }

    //===

    function requestByCustomer(uint256 _tokenID, uint256 _quantity) public {
        console.log(wallmartAddress);
        require(
            balanceOf(wallmartAddress, _tokenID) >= _quantity,
            "Wallmart does not have this much quantity"
        );
        _customerIds.increment(); // initial value 1
        uint256 customerId = _customerIds.current();

        Request memory requesting;
        requesting.requestBy = _msgSender();
        requesting.tokenID = _tokenID;
        requesting.quantity = _quantity;
        requesting.status = RequestStatus.Pending;
        customerRequest[customerId] = requesting;
    }

    // wallmart response
    function wallmartResponseToCustomer(
        uint256 _customerRequestID,
        address _deliveryBy,
        bool _isApproved
    ) public {
        Request memory request = customerRequest[_customerRequestID];
        request.deliveryBy = _deliveryBy;
        request.status = _isApproved
            ? RequestStatus.Approved
            : RequestStatus.Rejected;

        if (_isApproved) {
            _setApprovalForAll(_msgSender(), request.deliveryBy, _isApproved);
            customerRequest[_customerRequestID].status = RequestStatus.Approved;
                safeTransferFrom(
            wallmartAddress,
            request.deliveryBy,
            request.tokenID,
            request.quantity,
            ""
        );
        customerRequest[_customerRequestID] = request;
                ////
        } else {
            _setApprovalForAll(_msgSender(), request.requestBy, _isApproved);
        }
    }
// Delivery Part Start

    function receivedByDeliveryPartner(uint256 _customerRequestID) public {
        Request memory request = customerRequest[_customerRequestID];
         _setApprovalForAll(_msgSender(),request.requestBy,true);
         console.log("dlvry",request.requestBy);
    }

// Delivery Part End

    // c
    function purchaseByCustomer(uint256 _customerRequestID) public payable {
        Request memory cRequest = customerRequest[_customerRequestID];
        require(
            cRequest.status == RequestStatus.Approved,
            "Request status is not APPROVED"
        );
        require(cRequest.requestBy == msg.sender, "Unauthorised");

        Product memory product = products[cRequest.tokenID];
        uint256 productCost = product.priceForCustomer * cRequest.quantity;
        console.log("==> ", productCost, msg.value);
        require(msg.value == productCost, "Please send exact product price");
        // transfering quantity from wallmart to customer
        safeTransferFrom(
            cRequest.deliveryBy,
            cRequest.requestBy,
            cRequest.tokenID,
            cRequest.quantity,
            ""
        );

        // transfer money from customer to wallmart
        payable(wallmartAddress).transfer(productCost);
        cRequest.status = RequestStatus.Complete;
        customerRequest[_customerRequestID] = cRequest;
        _setApprovalForAll(wallmartAddress, msg.sender, false);
    }

    function getTotalWallmartRequest() public view returns (uint256) {
        return _requestIds.current();
    }

    function getTotalCustomerRequest() public view returns (uint256) {
        return _customerIds.current();
    }
}
