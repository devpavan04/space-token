// SPDX-License-Identifier: MIT
pragma solidity >0.5.0;
pragma experimental ABIEncoderV2;

contract SpaceToken {
	// name
	string public constant name = "Space";

	// symbol
	string public constant symbol = "SPACE";

	// 500 SPACE tokens
	uint256 public constant totalSupply = 500;

	// token balance of each address
	mapping (address => uint256) internal _balances;

	// allowance no. of tokens on behalf of other
	mapping (address => mapping (address => uint256)) internal _allowances;

	// transfer event
	event Transfer(address from, address to, uint256 value);

	// approval event
	event Approval(address owner, address spender, uint256 value);

	// allocate all tokens to admin on deployment
	constructor(address _address) {
		_balances[_address] = totalSupply;
		emit Transfer(address(0), _address, totalSupply);
	}

	// token balance of each address
	function balanceOf(address _address) public view returns (uint256) {
		return _balances[_address];
	}

	// _transferTokens
	function _transferTokens(address _from, address _to, uint256 _value) internal {
		require(_from != address(0));
		require(_to != address(0));
		require(_balances[_from] >= _value);
		_balances[_from] -= _value;
		_balances[_to] += _value;
	}

	// transfer
	function transfer(address _to, uint256 _value) public returns (bool success) {
		_transferTokens(msg.sender, _to, _value);
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	// _approveTokens
	function _approveTokens(address _owner, address _spender, uint256 _value) internal {
    require(_balances[_owner] >= _value);
		_allowances[_owner][_spender] = _value;
	}

	// approve
	function approve(address _spender, uint256 _value) public returns (bool success) {
		_approveTokens(msg.sender, _spender, _value);
		emit Approval(msg.sender, _spender, _value);
    return true;
	}

	// getTokensApproved
	function getTokensApproved(address _owner, address _spender) public view returns (uint256) {
		return _allowances[_owner][_spender];
	}

	// _deductApprovedTokens
	function _deductApprovedTokens(address _owner, address _spender, uint256 _value) internal {
		_allowances[_owner][_spender] -= _value;
	}

	// transferFrom
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
		address spender = msg.sender;
		uint256 spenderAllowance = _allowances[_from][spender];
		require(spenderAllowance >= _value);
		_transferTokens(_from, _to, _value);
		_deductApprovedTokens(_from, spender, _value);
		emit Transfer(_from, _to, _value);
		return true;
	}
}