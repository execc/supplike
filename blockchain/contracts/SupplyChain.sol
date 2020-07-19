/// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.8;

/**
* @title Structured Supply Chain Factory Contract
* @author Denis Vasin
* @notice Implements creating of a concrete supply chain contract using metadata
*/
contract SupplyChainFactory {

   /**
    * @notice Supply chain contracts data. Allows to lookop contracts by it's owners
    */
    mapping(address => address[]) public contracts;

    function deployChain() public returns(address) {
        SupplyChain chain = new SupplyChain(msg.sender);
        address newAddress = address(chain);
        contracts[msg.sender].push(newAddress);
        return newAddress;
    }

    function getMyChains() public view returns (address[] memory) {
        return getOwnedChains(msg.sender);
    }

    function getOwnedChains(address _owner) public view returns (address[] memory) {
        return contracts[_owner];
    }
}

/**
* @title Structured Supply Chain
* @author Denis Vasin
* @notice Implements a basic directed acyclyc graph supply chain with steps metadata
*/
contract SupplyChain {

   /**
    * @notice Supply chain batch data. By chaining these and not
    * allowing them to be modified afterwards we create an Acyclic
    * Directed Graph.
    * @dev The step id is not stored in the Step itself because it
    * is always previously available to whoever looks for the step.
    * @param creator The creator of this step.
    * @param id The id of the object that this step refers to.
    * @param precedents The step ids preceding this one in the
    * supply chain.
    */
   struct Batch {
       address creator;
       uint256 id;
       uint256[] precedents;
   }

   /**
    * @notice Item counter
    */
   uint256 public totalItems;

   /**
    * @notice Item to batch mapping
    */
   mapping(uint256 => uint256) public itemsToBatches;

   /**
    * @notice All batches are accessible through a mapping keyed by
    * the batch ids. Recursive structs are not supported in solidity.
    */
   mapping(uint256 => Batch) public batches;

   /**
    * @notice Batch counter
    */
   uint256 public totalBatches;

   /**
    * @notice Mapping from batch id to the last step in the lifecycle
    * of that item.
    */
   mapping(uint256 => uint256) public lastSteps;


   /**
    * @notice Owner of this supply chain contract
    */
   address public owner;

   constructor(address _owner) public {
       require(_owner != address(0), "Owner should be set");
       owner = _owner;
   }

  /**
    * @notice A method to create a new supply chain step. The
    * msg.sender is recorded as the creator of the step, which might
    * possibly mean creator of the underlying asset as well.
    * @param _id The item id that this step is for. This must be
    * either the item of one of the steps in _precedents, or an id
    * that has never been used before.
    * @param _precedents An array of the step ids for steps
    * considered to be predecessors to this one. Often this would
    * just mean that the event refers to the same asset as the event
    * pointed to, but for other steps it could point to other
    * different assets.
    * @param _quantity A quantity of items being created during
    * step processing
    * @return The step id of the step created.
    */
   function newBatch(uint256 _id, uint256[] memory _precedents, uint256 _quantity)
       public
       returns(uint256)
   {
       require(_quantity > 0, "Quantity of items in batch should be more then 0");

       for (uint i = 0; i < _precedents.length; i++){
           require(
               isLastStep(_precedents[i]),
               "Append only on last steps."
           );
       }
       bool repeatInstance = false;
       for (uint i = 0; i < _precedents.length; i++){
           if (batches[_precedents[i]].id == _id) {
               repeatInstance = true;
               break;
           }
       }
       if (!repeatInstance){
           require(lastSteps[_id] == 0, "Instance not valid.");
       }

       batches[totalBatches] = Batch(
           msg.sender,
           _id,
           _precedents
       );

       uint256 batch = totalBatches;
       totalBatches += 1;
       lastSteps[_id] = batch;

       for (uint i = 0; i < _quantity; i++) {
         uint256 item = totalItems;
         totalItems += 1;
         itemsToBatches[item] = _id;
       }

       return batch;
   }

   /**
    * @notice A method to verify whether a step is the last of an
    * item.
    * @param _step The step id of the step to verify.
    * @return Whether a step is the last of an item.
    */
   function isLastStep(uint256 _step)
       public
       view
       returns(bool)
   {
       return lastSteps[batches[_step].id] == _step;
   }
   /**
    * @notice A method to retrieve the precedents of a step.
    * @param _step The step id of the step to retrieve precedents
    * for.
    * @return An array with the step ids of the precedent steps.
    */
   function getDirectPrecedents(uint256 _step)
       public
       view
       returns(uint256[] memory)
   {
       return batches[_step].precedents;
   }
}