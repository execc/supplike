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

    function deployChain(
        uint256[] memory _roles,
        uint256[] memory _stepRoles,
        uint256[] memory _transitions
    ) public returns(address) {
        SupplyChain chain = new SupplyChain(msg.sender, _roles, _stepRoles, _transitions);
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

    /// Modifiers
    modifier onlyOwner()
    {
        require(
            msg.sender == owner,
            "Sender not authorized."
        );

        _;
    }
    /// End modifiers

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
    * @notice Supply chain step meta-data. By changing these you are allowed
    * to control what participant in supply chain is able to do
    * @param role Role identifiers that are able to execute that step
    */
   struct Step {
       uint256 role;
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
    * the step ids.
    */
   mapping(uint256 => Batch) public batches;

  /**
    * @notice All steps are accessible through a mapping keyed by
    * the step ids.
    */
   mapping(uint256 => Step) public steps;

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

   /**
    * @notice Mapping from contract user to it's roles
    */
   mapping(address => uint256) public userRoles;

   /**
    * @notice Mapping from contract user to it's roles
    */
   mapping(uint256 => uint256) public roles;

   /**
    * @notice This map describes possible transitions between
    * various supply chain stages
    */
   mapping(uint256 => uint256[]) public transitions;

   /**
    * @notice This map describes current states of steps in
    * supply chain
    */
   mapping(uint256 => uint256) public states;

   constructor(
       address _owner,
       uint256[] memory _roles,
       uint256[] memory _stepRoles,
       uint256[] memory _transitions
    ) public {
       require(_owner != address(0), "Owner should be set");
       require(_roles.length > 0, "Roles should be set");
       require(_stepRoles.length > 0, "Step roles should be set");
       require(_transitions.length > 0, "Transitions should be set");

       owner = _owner;

       for (uint i = 0; i < _roles.length; i++) {
           require(_roles[i] > 0, "Invalid role id");

           roles[_roles[i]] = _roles[i];
       }

       for (uint i = 0; i < _stepRoles.length; i++) {
           require(roles[_stepRoles[i]] > 0, "Invalid role ID in step");

           steps[i + 1] = Step(
               _stepRoles[i]
           );
       }

       for (uint i = 0; i < _transitions.length; i += 2) {
           transitions[_transitions[i + 1]].push(_transitions[i]);
       }

   }

  /**
    * @notice A method to assign a certain contract user a certain role
    * @param _user A user to assign role
    * @param _role A role from a list of possible roles of this contract
    */
   function addUserToRole(address _user, uint256 _role) public onlyOwner() {
       require(_role > 0, "Role of 0 is reserved");
       require(_user != address(0), "Address should be set");

       userRoles[_user] = _role;
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
    * @param _sid A step id in supply chain
    * @return The step id of the step created.
    */
   function newBatch(
        uint256 _id,
        uint256[] memory _precedents,
        uint256 _quantity,
        uint256 _sid
    )
       public
       returns(uint256)
   {
       require(_quantity > 0, "Quantity of items in batch should be more then 0");
       require(isAllowed(msg.sender, _sid), "Invalid user role");
       require(isTransitionPossible(_precedents, _sid), "Transition is not possible by state model");

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
           require(lastSteps[_id] == 0, "Instance reuse is not possible");
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

       states[batch] = _sid;

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

   /**
    * @notice A method to retrieve if the given user can execute given step id
    * @param _user Contract user
    * @param _sid Step id
    * @return A boolen value inidicating a possiblity of step execution
    */
   function isAllowed(address _user, uint256 _sid) public view returns (bool) {
       return
        userRoles[_user] != 0 &&
        steps[_sid].role == userRoles[_user];
   }

   /**
    * @notice A method to retrieve if the given precedents could be used to execute given step
    * @param _precedents Previous step identifiers
    * @param _sid Step id
    * @return A boolen value inidicating a possiblity of step execution
    */
   function isTransitionPossible(
       uint256[] memory _precedents,
       uint256 _sid
   ) public view returns (bool) {
       uint256[] memory required = transitions[_sid];
       uint256 count = required.length;

       if (_precedents.length != count) {
           // Extra precedents are not allowed
           return false;
       }

       // First check if target step
       for (uint i = 0; i < _precedents.length; i++) {
           uint256 state = states[_precedents[i]];
           require(state != 0, "Non existing state for precedent");

           for (uint j = 0; j < required.length; j++) {
               if (required[j] == state) {
                   count--;
               }
           }
       }

       return count == 0;
   }
}